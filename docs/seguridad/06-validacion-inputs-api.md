# 6. Validación de inputs en endpoints API

## ¿Qué es?

Validar inputs significa comprobar, **antes** de usar un dato que llega de fuera (query params, cuerpo de un POST), que tiene el tipo y la forma esperada. Es la primera barrera contra payloads malformados, abuso de un endpoint, o datos inesperados que rompan la lógica de negocio (o que se cuelen hasta una llamada a un servicio externo de pago, como un LLM).

## Dónde vive en LoboApp

### `POST /api/search` — búsqueda en lenguaje natural

`src/app/api/search/route.ts`, líneas 41-45:

```typescript
export const POST = async (req: NextRequest) => {
    const body = await req.json().catch(() => null);
    if (!body?.query || typeof body.query !== "string" || body.query.length > 300) {
        return NextResponse.json({ error: "Consulta inválida" }, { status: 400 });
    }
    // ...
```

Más abajo, líneas 60-69, también se valida la *respuesta* del LLM antes de usarla para construir la consulta a la base de datos:

```typescript
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
```

### `GET /spaces` — listado paginado de salas

`src/app/spaces/route.tsx`, líneas 6-15:

```typescript
export const GET = async (req: NextRequest) => {
    const pageParam = req.nextUrl.searchParams.get("page");
    const typeParam = req.nextUrl.searchParams.get("type");
    const cupoParam = req.nextUrl.searchParams.get("cupo");
    const edifParam = req.nextUrl.searchParams.get("edif");

    if ((pageParam?.length ?? 0) > 3) return new Response("Malformed.", { status: 400 });
    if ((typeParam?.length ?? 0) > 25) return new Response("Malformed.", { status: 400 });
    if ((cupoParam?.length ?? 0) > 3) return new Response("Malformed.", { status: 400 });
    if ((edifParam?.length ?? 0) > 30) return new Response("Malformed.", { status: 400 });
```

## Cómo funciona paso a paso

1. **`/api/search`**:
   - `req.json().catch(() => null)` evita que un cuerpo de petición malformado (JSON inválido) tire una excepción no controlada — si falla el parseo, `body` queda en `null` en vez de lanzar un error 500.
   - La condición `!body?.query || typeof body.query !== "string" || body.query.length > 300` rechaza con `400 Bad Request` si: no hay `query`, no es un string, o excede 300 caracteres. Ese límite de longitud importa especialmente aquí porque `query` se reenvía como prompt a un modelo de lenguaje (Groq) — sin este límite, alguien podría mandar un texto enorme y generar costo/latencia innecesarios en cada petición.
   - Tras recibir la respuesta del LLM, el código **no confía ciegamente** en que el modelo devolvió JSON válido: lo envuelve en `try { JSON.parse(raw) } catch { ... }` y responde `422` si no se pudo interpretar.
   - Tampoco confía en que el LLM siempre devuelva al menos un filtro útil: si `filters` no tiene ningún campo poblado (`hasFilter` es falso), responde `422` en vez de ejecutar una consulta sin filtros a la base de datos.

2. **`/spaces`**:
   - Cada query param tiene un límite de longitud razonable para su tipo de dato (`page` ≤ 3 caracteres porque es un número de página pequeño, `edif` ≤ 30 porque es un nombre de edificio, etc.). Si algún parámetro excede ese límite, la petición se rechaza inmediatamente con `400` antes de tocar la base de datos.

## Qué protege / qué riesgo mitiga

- Evita que tipos inesperados (un objeto, un array, `undefined`) lleguen hasta el `groq.chat.completions.create(...)` o hasta el query builder de Supabase, donde podrían causar errores poco claros o comportamientos no previstos.
- El límite de 300 caracteres en `query` actúa como freno básico contra abuso del endpoint (cada llamada exitosa cuesta una petición real al servicio de Groq).
- Los límites de longitud en `/spaces` descartan de forma barata (sin ninguna consulta a la base de datos) peticiones claramente malformadas.

## Limitaciones actuales y recomendaciones

- La validación es de **longitud y tipo**, no de **contenido**: por ejemplo, `cupoParam` se valida por longitud (`≤ 3` caracteres) pero luego se convierte con `parseInt(cupoParam || "0")` sin comprobar si el resultado es `NaN` (por ejemplo, si alguien manda `cupo=abc`, que tiene longitud 3 y pasa la validación, `parseInt("abc")` da `NaN`, y ese `NaN` se pasaría a `.gte("cupo", NaN)`). No causa una vulnerabilidad grave aquí (Supabase simplemente no devolvería filas), pero es un caso no cubierto explícitamente.
- Ninguno de estos dos endpoints valida que el usuario esté autenticado — eso se trata en [05 - Autorización y RBAC](05-autorizacion-roles-rbac.md) y queda señalado ahí como una limitación a resolver antes de manejar datos sensibles.
- Para una validación más robusta y declarativa a futuro, conviene considerar una librería como `zod` para definir un *schema* por endpoint en lugar de cadenas de `if` manuales — hace los límites más explícitos y fáciles de mantener a medida que crecen los campos validados.
