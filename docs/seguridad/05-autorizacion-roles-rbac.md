# 5. Autorización y control de roles (RBAC)

## ¿Qué es?

*Role-Based Access Control* (RBAC) significa decidir qué puede ver o hacer un usuario según su **rol** (estudiante, staff/maestro, administrador), en lugar de tratar a todos los usuarios autenticados por igual. LoboApp codifica el rol directamente en el payload del JWT (`admin: boolean`, `staff: boolean`) y expone un conjunto de componentes de React que renderizan contenido condicionalmente según esos flags.

## Dónde vive en LoboApp

### Los guards de rol

`src/stores/user.tsx`, líneas 52-79:

```typescript
export const IfAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user?.admin && children;
};
export const IfNotAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user && !(user?.admin) && children;
};
export const IfStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user?.staff && children;
};
export const IfNotStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user && !(user?.staff) && children;
};
export const IfLogged: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return user && children;
};
export const IfNotLogged: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    return !user && children;
};
export const LogoutButton: React.FC<{ children: React.ReactNode, classes: string[] }> = ({ children, classes }) => {
    const { logOut } = useUser();
    return <IfLogged><button onClick={logOut} className={classes?.join(" ")}>{children}</button></IfLogged>;
};
```

### Uso real en el dashboard

`src/app/page.tsx`, líneas 9-26 y 59-73:

```tsx
const Dash = () => <div className="space-y-8 fade-in">
    <IfLogged>
        <header className="mb-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    <IfAdmin>Panel de Administración</IfAdmin>
                    <IfNotAdmin>Bienvenido, <FirstName/></IfNotAdmin>
                </h1>
                <p className="text-gray-600">
                    <IfAdmin>Gestiona todos los espacios y reservaciones del campus</IfAdmin>
                    <IfNotAdmin>Sistema de reservación de espacios universitarios</IfNotAdmin>
                </p>
            </div>
        </header>
    </IfLogged>
    <IfNotLogged>
        <Login/>
    </IfNotLogged>

    <IfLogged>
        {/* ... */}
        <IfAdmin>
            <AnimatedCard delay={200}>
            <ALink to="/admin">
                <GlassCard hover className="h-full group">
                    {/* tarjeta de "Estadísticas", solo visible para admin */}
                </GlassCard>
            </ALink>
            </AnimatedCard>
        </IfAdmin>
    </IfLogged>
</div>;
```

## Cómo funciona paso a paso

1. Al iniciar sesión, el JWT incluye `admin` y `staff` como booleanos (ver [03 - Autenticación JWT](03-autenticacion-jwt.md)): un estudiante recibe `{ admin: false, staff: false }`, un maestro `{ admin: false, staff: true }`, un administrador `{ admin: true, staff: true }`.
2. `UserContext` decodifica ese token y expone `user` (con esos flags) a través de `useUser()`.
3. Componentes como `<IfAdmin>`, `<IfStaff>`, `<IfLogged>` leen `user` del contexto y deciden si renderizan sus `children` o `false` (que React simplemente no pinta en el DOM).
4. En `page.tsx`, el título del dashboard cambia completamente según el rol (`"Panel de Administración"` vs. `"Bienvenido, {nombre}"`), y la tarjeta de "Estadísticas" que enlaza a `/admin` solo aparece envuelta en `<IfAdmin>`.
5. `<LogoutButton>` reutiliza `<IfLogged>` internamente, así que el botón de cerrar sesión nunca aparece si no hay un usuario activo.

## Qué protege / qué riesgo mitiga

- Evita que un estudiante o maestro vea, en la interfaz normal de uso, enlaces o paneles que no le corresponden (ej. no ve "Panel de Administración" ni el acceso a `/admin`).
- Centraliza la lógica de "¿qué rol tiene este usuario?" en un solo lugar (`src/stores/user.tsx`) en vez de repetir `if (user.admin)` por todo el código — cualquier cambio futuro en cómo se determina el rol solo se edita ahí.
- Este comportamiento está verificado automáticamente con tests end-to-end (ver [09 - Testing con Playwright](09-testing-seguridad-playwright.md)), que simulan cada rol y comprueban qué debe/no debe ser visible.

## Limitaciones actuales y recomendaciones

- **Es RBAC del lado del cliente únicamente.** Estos guards solo deciden qué se *renderiza*; no impiden que alguien navegue manualmente a `/admin` escribiendo la URL, ni que llame directamente a un endpoint de administración con `fetch` desde la consola del navegador. Ocultar un botón no es lo mismo que proteger la acción que ese botón dispara.
- Hoy no existe la página `/admin` en el repositorio (`src/app/admin` no existe todavía) ni Route Handlers para `ENDPOINTS.ADMIN.newPlace` / `killPlace` / `newAdmin` (definidos como rutas vacías `""` en `src/lib/constants.tsx`) — son placeholders para funcionalidad futura.
- **Recomendación para cuando se implementen**: cada una de esas rutas de administración debe repetir, del lado del servidor, la misma verificación que hoy solo existe en la UI: leer el JWT del header `Authorization`, verificarlo con `jwt.verify(token, process.env.JWT_SECRET)` y confirmar `admin === true` antes de ejecutar cualquier cambio en Supabase. La regla general de RBAC es: **la UI oculta para mejorar la experiencia; el servidor rechaza para garantizar la seguridad** — ambas capas son necesarias, pero solo la segunda es una medida de seguridad real.
- También conviene proteger la *ruta* `/admin` en sí (no solo sus llamadas API) con un `middleware.ts` de Next.js que redirija a usuarios no-admin antes de que la página llegue a renderizarse; actualmente el proyecto no tiene `middleware.ts`.
