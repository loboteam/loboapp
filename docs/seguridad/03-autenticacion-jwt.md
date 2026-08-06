# 3. Autenticación basada en JWT

## ¿Qué es?

Un **JSON Web Token (JWT)** es un token firmado que codifica datos (el *payload*) junto con una firma criptográfica. El servidor lo emite tras validar las credenciales del usuario; el cliente lo guarda y lo reenvía para demostrar "ya inicié sesión" sin que el servidor tenga que mantener una sesión en memoria/base de datos. LoboApp usa la librería `jsonwebtoken` para emitir estos tokens en el login.

## Dónde vive en LoboApp

### Emisión del token — login de staff

`src/app/login/staff/route.tsx`:

```typescript
import { LoginRequest } from "@/lib/promisd";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { id, pwdHash }: LoginRequest = await req.json();
    if (id == "2020200" && pwdHash == "e0a2e959c1f3abff81a1...")
        return new NextResponse(JSON.stringify({
                id,
                name: "Sample Staff",
                token: jwt.sign({ id, name: "Sample Staff", admin: false, staff: true }, "samplesecretkey"),
                admin: false,
                staff: true
        }));
    if (id == "2020555" && pwdHash == "c19b191f9f49a2f26976...")
        return new NextResponse(JSON.stringify({
                id,
                name: "Sample Admin",
                token: jwt.sign({ id, name: "Sample Admin", admin: true, staff: true }, "samplesecretkey"),
                admin: true,
                staff: true
        }));
    return new Response("null", {status: 403});
};
```

*(los hashes SHA-512 completos de 128 caracteres fueron truncados en este documento por limpieza; en el código real están completos)*

### Emisión del token — login de estudiante

`src/app/login/student/route.tsx`:

```typescript
export const POST = async (req: Request) => {
    const { id, pwdHash }: LoginRequest = await req.json();
    if (id == "2020100" && pwdHash == "7d987b1801844192c274...")
        return new NextResponse(JSON.stringify({
                id,
                name: "Sample Student",
                token: jwt.sign({ id, name: "Sample Staff", admin: false, staff: false }, "samplesecretkey"),
                admin: false,
                staff: false
        }));
    return new Response("null", {status: 403});
};
```

### Lectura del token en el cliente

`src/stores/user.tsx`, líneas 20-32:

```typescript
const userJwt = () => {
    const s = localStorage.getItem("token");
    if (!s) return undefined;
    const dec = jwt.decode(s, { json: true });
    if (!dec) return undefined;
    try {
        let h = dec as User;
        return h;
    } catch (e) {
        console.error(`invalid token payload! got ${e}`);
        return undefined;
    }
};
```

### Generación del request de login y persistencia del token

`src/stores/login.tsx`, líneas 23-29:

```typescript
const logIn = (staff: boolean=false) => {
    if (id.length > 1 && pwd.length > 1)
        return sha512(pwd).then(pwdHash => fetch(ENDPOINTS.login[staff ? "staff" : "student"], { method: "POST", body: JSON.stringify({ id, pwdHash }) })).then(r => r.json()).then((r: User | undefined) => {
            setUser(r);
            if (perma) localSet("token", r?.token)
        }).catch(e => console.error("Ack! Bad login action! Got: ", e));
        throw new Error("incomplete login info!");
    }
```

### Cierre de sesión

`src/stores/user.tsx`, línea 47:

```typescript
const logOut = ()=>localClear().then(()=>setUser(undefined));
```

## Cómo funciona paso a paso

1. El usuario escribe su matrícula (`id`) y contraseña en el formulario de login (`src/stores/login.tsx`).
2. La contraseña se hashea con SHA-512 **en el navegador** antes de enviarse (`sha512(pwd)` — ver [04 - Hashing de contraseñas](04-hashing-contrasenas-cliente.md)); por la red solo viaja el hash, nunca la contraseña en texto plano.
3. El navegador hace `POST` a `/login/staff` o `/login/student` (según el formulario usado) con `{ id, pwdHash }`.
4. El Route Handler del servidor compara `id` y `pwdHash` contra valores conocidos. Si coinciden, llama a `jwt.sign({ id, name, admin, staff }, "samplesecretkey")`, que produce un JWT firmado con ese *secret* y lo devuelve junto con los datos del usuario.
5. El cliente recibe la respuesta, la guarda en el estado de React (`setUser(r)`) y, si el usuario marcó "recordarme" (`perma`), también la persiste en `localStorage` con `localSet("token", r?.token)`.
6. En cada carga de la app, `UserContext` ejecuta `userJwt()` (línea 45 de `user.tsx`, `useEffect(()=>setUser(userJwt()),[])`), que lee el token de `localStorage` y usa `jwt.decode()` para extraer el payload (`id`, `name`, `admin`, `staff`) y restaurar la sesión sin tener que volver a pedir credenciales.
7. Al cerrar sesión, `logOut()` limpia **todo** `localStorage` (`localClear()`), eliminando el token.

## Qué protege / qué riesgo mitiga

- El servidor no necesita guardar sesiones en memoria ni en base de datos: toda la información de la sesión (`id`, `name`, `admin`, `staff`) vive firmada dentro del propio token.
- El payload del JWT está firmado, así que en teoría un token alterado a mano (por ejemplo, cambiando `"admin": false` a `"admin": true`) no pasaría una verificación de firma (`jwt.verify`) en el servidor — siempre que el servidor llegue a verificarlo (ver limitación abajo).

## Limitaciones actuales y recomendaciones

Este es el área con más espacio de mejora del proyecto, y vale la pena ser explícito porque son simplificaciones intencionales de un proyecto de práctica/curso, no errores accidentales:

- **El secreto de firma es literalmente la palabra `"samplesecretkey"`**, igual en ambos endpoints de login y en los tests de Playwright (`tests/roles.spec.ts`, línea 9: *"El valor de aquí es irrelevante porque en react solo se hace `jwt.decode()`"*). Antes de manejar cuentas reales, este secreto debe:
  - Moverse a una variable de entorno (`process.env.JWT_SECRET`), siguiendo el mismo patrón que [01](01-variables-de-entorno.md).
  - Ser un valor largo y aleatorio (no una palabra de diccionario).
- **El cliente usa `jwt.decode()`, no `jwt.verify()`** (`src/stores/user.tsx`, línea 23). `decode()` simplemente lee el payload en Base64 sin comprobar la firma — es la razón por la que el propio test de Playwright puede generar un token válido para la UI firmándolo con cualquier secreto, ya que nadie lo verifica del lado del cliente. Esto es aceptable para *decidir qué mostrar en pantalla* (UX), pero **no** es una garantía de seguridad: cualquier persona con acceso a la consola del navegador podría escribir un JWT con `"admin": true` en `localStorage.token` y la UI lo mostraría como administrador.
- **Las rutas API que devuelven datos (`/spaces`, `/api/search`) no leen ni verifican el token en absoluto** — no hay un `jwt.verify(token, secret)` en el servidor que bloquee la petición si el usuario no es admin. La autorización real hoy ocurre solo en la interfaz (ver [05 - Autorización y RBAC](05-autorizacion-roles-rbac.md)).
- **No hay expiración (`expiresIn`)** en los tokens emitidos — una vez generado, un token es válido indefinidamente mientras no se borre de `localStorage`.
- Recomendación concreta para cuando se implementen endpoints sensibles (los de `ENDPOINTS.ADMIN` en `src/lib/constants.tsx`, hoy con rutas vacías `""` como placeholder): cada Route Handler que modifique datos debe leer el header `Authorization`, hacer `jwt.verify(token, process.env.JWT_SECRET)` y comprobar `decoded.admin === true` **antes** de tocar la base de datos — nunca confiar en que la UI ya ocultó el botón.
