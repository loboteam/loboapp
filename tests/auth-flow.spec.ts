import { test, expect, Page, Route } from '@playwright/test';
import * as jwt from 'jsonwebtoken';

// Interceptor del comportamiento de red
// Cuando Next.js intenté ir a `fetch(/app/login/...)` vamos a capturarlo nosotros sin que llegue a la BD.
const mockBackend = async (page: Page) => {
    await page.route('**/login/*', async (route: Route) => {
        const isStaff = route.request().url().includes('/staff');
        
        const role = isStaff 
            ? { staff: true, admin: true, name: "Admin Test" } 
            : { staff: false, admin: false, name: "Student Test" };
            
        const dummyToken = jwt.sign(role, "samplesecretkey");
        
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                ...role,
                token: dummyToken,
            })
        });
    });
};

test.describe('Flujo de Autenticación Interactivo', () => {

    test('Ciclo Completo: Iniciar, Salir y Re-ingresar', async ({ page }) => {
        await mockBackend(page);
        
        // 1. Entramos a la raíz que no tiene sesión activa
        await page.goto('/');
        
        // Verificamos que se muestre el formulario
        await expect(page.locator('text=Entrar como Estudiante')).toBeVisible();
        
        // Tecleamos credenciales dummy y entramos
        await page.fill('input[placeholder="2000345678"]', '2020100');
        await page.fill('input[placeholder="••••••••"]', '123456');
        await page.click('text=Entrar como Estudiante');
        
        // Debería procesar nuestro interceptor y mostrar un dashboard sin admin
        await expect(page.locator('text=Bienvenido, Student')).toBeVisible();
        await expect(page.locator('text=Panel de Administración')).not.toBeVisible();
        
        // 2. Cerrar sesión usando el botón "Salir"
        // Este botón existe en el sidebar en la versión actual del layout
        await page.click('text=Salir');
        
        // Comprobamos que el router reaccionó retornándonos al LoginForm
        await expect(page.locator('text=Entrar como Administrador')).toBeVisible();
        
        // Además, localStorage debe estar limpio
        const token = await page.evaluate(() => window.localStorage.getItem('token'));
        expect(token).toBeNull();
        
        // 3. Reingresar (esta vez como administrador)
        await page.fill('input[placeholder="2000345678"]', '999999');
        await page.fill('input[placeholder="••••••••"]', 'adminpass');
        await page.click('text=Entrar como Administrador');
        
        // La UI debería hidratarse con los permisos grandes.
        await expect(page.locator('text=Panel de Administración')).toBeVisible();
    });

    test('Concurrencia: Usuarios en distintos navegadores no entrelazan sesiones', async ({ browser }) => {
        // En lugar de usar la variable 'page' general (que pertenece a un solo contexto base)
        // Creamos dos "Pestañas / Ventanas de incógnito" 100% aisladas
        const contextAdmin = await browser.newContext();
        const contextStudent = await browser.newContext();
        
        const pageAdmin = await contextAdmin.newPage();
        const pageStudent = await contextStudent.newPage();
        
        // Aplicamos el mock a ambas ventanas
        await mockBackend(pageAdmin);
        await mockBackend(pageStudent);
        
        // Las dos van a la misma web app al mismo tiempo
        await pageAdmin.goto('/');
        await pageStudent.goto('/');
        
        // Ventana #1: Inicia alguien como Admin
        await pageAdmin.fill('input[placeholder="2000345678"]', '999999');
        await pageAdmin.fill('input[placeholder="••••••••"]', 'adminpass');
        await pageAdmin.click('text=Entrar como Administrador');
        await expect(pageAdmin.locator('text=Panel de Administración')).toBeVisible();
        
        // Ventana #2: Al mismo tiempo otro inicia como Estudiante común
        await pageStudent.fill('input[placeholder="2000345678"]', '2020100');
        await pageStudent.fill('input[placeholder="••••••••"]', '123456');
        await pageStudent.click('text=Entrar como Estudiante');
        await expect(pageStudent.locator('text=Bienvenido, Student')).toBeVisible();
        
        // Aserción Final: La UI de estudiante no "hereda" temporalmente cosas 
        // del state del admin, demostrando que Context y localStorage están operando limpios por usuario.
        await expect(pageStudent.locator('text=Panel de Administración')).not.toBeVisible();
        
        // Y viceversa, la ventana del admin está a salvo de cruzarse
        await expect(pageAdmin.locator('text=Bienvenido, Student')).not.toBeVisible();
    });

});
