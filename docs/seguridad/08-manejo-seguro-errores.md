# 8. Manejo seguro de errores

## ¿Qué es?

Cómo responde una API cuando algo falla importa tanto como qué hace cuando todo va bien. Devolver el mensaje de error interno tal cual (un stack trace, el mensaje crudo de una excepción, detalles de una librería interna) puede filtrar información útil para un atacante (rutas internas, versiones de librerías, nombres de tablas) y, en general, es una mala experiencia para quien consume la API. LoboApp captura los errores esperables en sus endpoints y devuelve mensajes genéricos en español, junto con el código de estado HTTP adecuado.

## Dónde vive en LoboApp

### `/api/search` — múltiples puntos de fallo controlados

`src/app/api/search/route.ts`:

```typescript
export const POST = async (req: NextRequest) => {
    const body = await req.json().catch(() => null);
    if (!body?.query || typeof body.query !== "string" || body.query.length > 300) {
        return NextResponse.json({ error: "Consulta inválida" }, { status: 400 });
    }
    // ...
    let filters: { type?: string | null; cupo_min?: number | null; cupo_max?: number | null; edif?: string | null; explanation?: string };
    try {
        filters = JSON.parse(raw);
    } catch {
        return NextResponse.json({ error: "No se pudo interpretar la búsqueda. Intenta ser más específico." }, { status: 422 });
    }

    const hasFilter = filters.type || filters.cupo_min || filters.cupo_max || filters.edif;
    if (!hasFilter) {
        return NextResponse.json({ error: "No entendí qué buscar. Prueba con: tipo de sala, capacidad o ubicación." }, { status: 422 });
    }

    // ...
    if (error) return NextResponse.json({ error: "Error al consultar la base de datos" }, { status: 500 });

    return NextResponse.json({ rooms: data, explanation: filters.explanation ?? "" });
};
```

### Login — falla cerrada con un único mensaje neutro

`src/app/login/staff/route.tsx`, línea 23 (y análogo en `student/route.tsx`):

```typescript
return new Response("null", {status: 403});
```

### Manejo en el cliente al consumir la búsqueda

`src/components/med/aisearch.tsx`, líneas 39-40:

```typescript
} catch (e: any) {
    setError(e.message ?? "No se pudo conectar con el buscador.");
}
```

## Cómo funciona paso a paso

1. **`req.json().catch(() => null)`**: si el cuerpo de la petición no es JSON válido, en vez de dejar que la excepción se propague (lo que en un Route Handler de Next.js resultaría en una respuesta `500` genérica del framework, sin control sobre el mensaje), se captura y `body` queda en `null`, que cae directo en la validación de la línea siguiente y responde `400` con un mensaje controlado.
2. **`JSON.parse(raw)` envuelto en `try/catch`**: la respuesta del LLM (Groq) debería ser JSON por el `response_format: { type: "json_object" }` configurado en la llamada, pero el código no asume que un servicio externo *siempre* cumple el contrato — si el parseo falla, se responde `422` con un mensaje en español orientado al usuario final ("Intenta ser más específico"), no con el texto crudo que devolvió el modelo.
3. **Error de Supabase (`if (error) return ...`)**: si la consulta a la base de datos falla, el código no reenvía `error` (que podría incluir detalles internos de PostgREST/Postgres) al cliente; responde un mensaje fijo ("Error al consultar la base de datos") con `500`.
4. **Login fallido**: cuando ninguna combinación de `id`/`pwdHash` coincide, la respuesta es siempre la misma — `403` con el cuerpo `"null"` — sin distinguir si el `id` no existe o si la contraseña es incorrecta. Esto evita que un atacante pueda usar el endpoint para enumerar qué matrículas existen en el sistema probando una por una.
5. **En el cliente**, `aisearch.tsx` muestra `e.message` solo como *fallback* cuando no hay una respuesta estructurada del servidor (por ejemplo, si la red falla por completo) — el mensaje principal mostrado al usuario es el `error` ya sanitizado que vino del servidor en los `NextResponse.json({ error: ... })` anteriores.

## Qué protege / qué riesgo mitiga

- Ningún endpoint de LoboApp reenvía un stack trace ni el mensaje de excepción crudo de Node.js/Supabase/Groq al cliente.
- El login no revela si el problema fue el `id` o el `pwdHash`, mitigando enumeración de usuarios válidos.
- Los códigos de estado HTTP (`400`, `403`, `422`, `500`) son semánticamente correctos, lo que ayuda al cliente a reaccionar apropiadamente sin necesidad de inspeccionar el texto del mensaje.

## Limitaciones actuales y recomendaciones

- `src/app/spaces/route.tsx` (línea 31) **no maneja el caso de error de Supabase**: la desestructuración `const { data } = await query...` ignora por completo el segundo valor (`error`) que devuelve el cliente de Supabase. Si la consulta fallara, `data` sería `null` y la respuesta sería `null` serializado con `200 OK` implícito, en vez de un `500` explícito con un mensaje claro — a diferencia de cómo sí se maneja en `/api/search`. Se recomienda alinear este endpoint con el patrón ya usado en `/api/search`:

  ```typescript
  const { data, error } = await query.order("type", { ascending: false }).order("number", { ascending: true });
  if (error) return new NextResponse(JSON.stringify({ error: "Error al consultar la base de datos" }), { status: 500 });
  return new NextResponse(JSON.stringify(data));
  ```
- `console.error(...)` se usa en un par de lugares (por ejemplo, `src/stores/user.tsx`, línea 29, y `src/stores/login.tsx`, línea 28) para registrar errores en la consola del navegador/servidor durante desarrollo. Esto es razonable mientras el proyecto está en fase de práctica, pero antes de producción conviene revisar que esos `console.error` no terminen imprimiendo datos sensibles (tokens, payloads completos) en logs accesibles, y considerar un logger centralizado en lugar de `console.*` directo.
