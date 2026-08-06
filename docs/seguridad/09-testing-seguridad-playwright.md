# 9. Testing de seguridad (autorización por rol) con Playwright

## ¿Qué es?

Más allá de revisar el código a simple vista, LoboApp tiene una prueba end-to-end automatizada que **arranca un navegador real**, simula sesiones con distintos roles (estudiante, maestro, administrador) y verifica que cada rol vea exactamente lo que debe ver — y, más importante para seguridad, que **no** vea lo que no le corresponde. Esto convierte las reglas de autorización descritas en [05 - Autorización y RBAC](05-autorizacion-roles-rbac.md) en algo verificable automáticamente, no solo en una promesa del código.

## Dónde vive en LoboApp

### Configuración de Playwright

`playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Las pruebas de roles

`tests/roles.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import * as jwt from 'jsonwebtoken';

async function setRoleContext(page: any, roleOptions: { name: string, staff: boolean, admin: boolean }) {
    const fakeToken = jwt.sign(
        { id: 999, name: roleOptions.name, staff: roleOptions.staff, admin: roleOptions.admin },
        "samplesecretkey" // El valor de aquí es irrelevante porque en react solo se hace jwt.decode()
    );

    await page.addInitScript((token: string) => {
        window.localStorage.setItem('token', token);
    }, fakeToken);
}

test.describe('Autenticación y Roles de Usuario', () => {

    test('1. Flujo de un Estudiante / Alumno', async ({ page }) => {
        await setRoleContext(page, { name: 'Juan Alumno', staff: false, admin: false });
        await page.goto('/');

        await expect(page.locator('text=Bienvenido, Juan')).toBeVisible();
        await expect(page.locator('text=Nueva Reservación')).toBeVisible();
        await expect(page.locator('text=Mis Reservas').first()).toBeVisible();

        await expect(page.locator('text=Panel de Administración')).not.toBeVisible();
        await expect(page.locator('text=Estadísticas')).not.toBeVisible();
    });

    test('2. Flujo de un Maestro / Staff', async ({ page }) => {
        await setRoleContext(page, { name: 'Profesor X', staff: true, admin: false });
        await page.goto('/');

        await expect(page.locator('text=Bienvenido, Profesor')).toBeVisible();
        await expect(page.locator('text=Mis Reservas').first()).toBeVisible();

        await expect(page.locator('text=Panel de Administración')).not.toBeVisible();
        await expect(page.locator('text=Estadísticas')).not.toBeVisible();
    });

    test('3. Flujo de un Administrador', async ({ page }) => {
        await setRoleContext(page, { name: 'Súper Admin', staff: true, admin: true });
        await page.goto('/');

        await expect(page.locator('text=Panel de Administración')).toBeVisible();
        await expect(page.locator('text=Estadísticas')).toBeVisible();

        await expect(page.locator('text=Bienvenido, Súper Admin')).not.toBeVisible();
    });

});
```

## Cómo funciona paso a paso

1. `setRoleContext(page, roleOptions)` construye un JWT con `jwt.sign(...)` exactamente como lo haría el endpoint de login real (ver [03](03-autenticacion-jwt.md)), pero sin pasar por la pantalla de login — el comentario en el propio código es explícito sobre por qué esto es válido para el test: *"el valor del secreto es irrelevante porque en React solo se hace `jwt.decode()`"* (la app nunca verifica la firma, ver la sección de limitaciones en [03](03-autenticacion-jwt.md)).
2. `page.addInitScript((token) => { window.localStorage.setItem('token', token); }, fakeToken)` inyecta ese token en `localStorage` **antes** de que la página cargue y se hidrate — así, cuando React monte `UserContext` y ejecute `userJwt()`, ya encuentra el token y restaura la sesión con el rol simulado.
3. `await page.goto('/')` navega a la página principal con esa sesión ya "activa".
4. Cada test usa `expect(...).toBeVisible()` y `expect(...).not.toBeVisible()` para afirmar tanto lo que **debe** aparecer (mensajes de bienvenida, accesos según rol) como, igual de importante, lo que **no debe** aparecer para ese rol — por ejemplo, el test del estudiante confirma explícitamente que `"Panel de Administración"` y `"Estadísticas"` **no** son visibles.
5. El test del administrador hace la verificación inversa: confirma que sí aparecen `"Panel de Administración"` y `"Estadísticas"`, y que **no** aparece el saludo de estudiante (`"Bienvenido, Súper Admin"`), confirmando que la rama `<IfAdmin>` / `<IfNotAdmin>` (ver [05](05-autorizacion-roles-rbac.md)) es mutuamente excluyente en la práctica, no solo en la lógica del código.
6. `playwright.config.ts` se encarga de levantar el servidor de desarrollo (`npm run dev`) automáticamente antes de correr los tests (`webServer.command`), así que `npx playwright test` es suficiente para correr toda la suite de punta a punta sin pasos manuales.

## Qué protege / qué riesgo mitiga

- Si en el futuro alguien modifica `src/app/page.tsx` o `src/stores/user.tsx` de forma que, por accidente, un estudiante también vea el "Panel de Administración" (por ejemplo, invirtiendo una condición `IfAdmin`/`IfNotAdmin` por error), el test `1. Flujo de un Estudiante / Alumno` fallaría inmediatamente al ejecutarse, antes de que ese cambio llegue a producción.
- Es una verificación de **regresión de autorización**: protege específicamente contra el tipo de bug donde el control de acceso se rompe silenciosamente tras un refactor, que de otra forma solo se detectaría manualmente (o, peor, lo detectaría un usuario real viendo contenido que no debía ver).

## Limitaciones actuales y recomendaciones

- Estos tests verifican **autorización a nivel de interfaz** (qué se renderiza), no autorización a nivel de servidor — son la contraparte de prueba de la limitación ya descrita en [05](05-autorizacion-roles-rbac.md): no hay (todavía) un test que confirme que `POST` a un endpoint de administración devuelva `403` para un token sin `admin: true`, porque esos endpoints aún no existen en el código (son rutas placeholder en `src/lib/constants.tsx`).
- Cuando se implementen los endpoints de `ENDPOINTS.ADMIN`, conviene añadir tests de API (con `request` de Playwright o con `fetch` directo) que verifiquen el rechazo del servidor para roles no autorizados — complementando, no reemplazando, estos tests de UI.
- No hay un workflow de GitHub Actions que corra `npx playwright test` automáticamente en cada Pull Request (no existe `.github/workflows/`, ver [02](02-proteccion-secretos-gitignore-github.md)) — hoy estos tests solo corren cuando alguien los ejecuta localmente. Añadir un workflow de CI que ejecute esta suite en cada PR convertiría esta protección de "disponible si te acuerdas de correrla" a "obligatoria antes de mergear".
