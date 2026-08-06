# 4. Hashing de contraseñas en el cliente (Web Crypto API)

## ¿Qué es?

*Hashing* es transformar un dato (una contraseña) en una huella digital de longitud fija que, en teoría, no se puede revertir a su valor original. LoboApp usa la **Web Crypto API** nativa del navegador (`crypto.subtle`) para calcular un hash **SHA-512** de la contraseña *antes* de que esta salga del dispositivo del usuario.

## Dónde vive en LoboApp

### La función de hashing

`src/lib/promisd.ts`, líneas 23-25:

```typescript
const sha512 = (str: any) => crypto.subtle.digest("SHA-512", new TextEncoder().encode(`${str}`)).then(buf =>
    Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('')
);
```

### Su uso antes de enviar el login

`src/stores/login.tsx`, línea 25:

```typescript
return sha512(pwd).then(pwdHash => fetch(ENDPOINTS.login[staff ? "staff" : "student"], {
    method: "POST",
    body: JSON.stringify({ id, pwdHash })
}))
```

### El servidor solo conoce el hash, nunca la contraseña

`src/app/login/staff/route.tsx`, línea 7:

```typescript
const { id, pwdHash }: LoginRequest = await req.json();
if (id == "2020200" && pwdHash == "e0a2e959c1f3abff81a1...")
```

## Cómo funciona paso a paso

1. El usuario escribe su contraseña en el campo `pwd` del formulario de login.
2. Al hacer submit, `logIn()` llama a `sha512(pwd)`.
3. `sha512()`:
   - Convierte el string a bytes con `TextEncoder().encode(...)`.
   - Llama a `crypto.subtle.digest("SHA-512", ...)`, la API criptográfica nativa del navegador (no una librería externa), que calcula el hash de 512 bits (64 bytes).
   - Convierte cada byte del resultado a su representación hexadecimal de 2 caracteres (`('00'+x.toString(16)).slice(-2)`) y concatena todo, produciendo un string hexadecimal de 128 caracteres.
4. Ese string (`pwdHash`), **no** la contraseña original, es lo que se incluye en el cuerpo del `fetch(...)` hacia `/login/staff` o `/login/student`.
5. El servidor recibe únicamente `pwdHash` y lo compara contra un valor de referencia hardcodeado (ver [03 - Autenticación JWT](03-autenticacion-jwt.md)). El servidor nunca recibe ni necesita conocer la contraseña real.

## Qué protege / qué riesgo mitiga

- **La contraseña en texto plano nunca viaja por la red** ni queda registrada en ningún log de servidor que capture el cuerpo de las peticiones (por ejemplo, logs de acceso o herramientas de debugging que impriman `req.body`).
- Si alguien inspeccionara el tráfico de red (DevTools → pestaña Network) vería el hash, no la contraseña.

## Limitaciones actuales y recomendaciones

Es importante distinguir dos usos distintos del hashing, porque este proyecto solo cubre uno de ellos:

1. **Ofuscar la contraseña en tránsito** (lo que SHA-512 aquí hace) — cumple su propósito.
2. **Almacenar contraseñas de forma segura en una base de datos** (lo que un sistema de cuentas reales necesitaría) — esto requiere un *algoritmo de hashing lento y con sal* como `bcrypt`, `scrypt` o `argon2`, no SHA-512.

SHA-512 es un hash **rápido y sin sal**, diseñado para integridad de datos, no para proteger contraseñas almacenadas:

- Es vulnerable a *rainbow tables* (tablas precalculadas de hash→contraseña para contraseñas comunes) porque no usa una sal (*salt*) aleatoria por usuario.
- Es rápido de calcular, lo que en un escenario de fuerza bruta contra una base de datos filtrada permitiría probar miles de millones de combinaciones por segundo en hardware moderno (a diferencia de `bcrypt`/`argon2`, diseñados deliberadamente para ser lentos).

En LoboApp esto tiene impacto limitado **hoy** porque no hay una tabla real de usuarios/contraseñas en Supabase — las credenciales válidas están hardcodeadas como hashes de referencia directamente en `route.tsx` (cuentas de ejemplo para la demo). Pero si el proyecto evoluciona a registrar contraseñas reales de usuarios en la base de datos, la recomendación es:

- No depender solo del SHA-512 del cliente para "ya está hasheada, así la guardo".
- Volver a hashear `pwdHash` en el servidor con `bcrypt.hash(pwdHash, 12)` (o `argon2`) antes de guardarla, y comparar con `bcrypt.compare(...)` en el login. El SHA-512 del cliente seguiría siendo útil como capa adicional (evita exponer la contraseña real incluso en tránsito), pero el almacenamiento debe usar un algoritmo diseñado para eso.
- Combinar esto con HTTPS/TLS en producción (transporte cifrado), que es independiente del hashing aplicativo: el hashing protege qué viaja en el cuerpo de la petición, TLS protege que nadie en la red intercepte esa petición en absoluto.
