import { test, expect } from '@playwright/test';
import * as jwt from 'jsonwebtoken';

// Función ayudante para crear un token simulado e inyectarlo en localStorage
async function setRoleContext(page: any, roleOptions: { name: string, staff: boolean, admin: boolean }) {
    // Al igual que localClear y el guard de IfLogged, dependemos de que exista este token
    const fakeToken = jwt.sign(
        { id: 999, name: roleOptions.name, staff: roleOptions.staff, admin: roleOptions.admin }, 
        "samplesecretkey" // El valor de aquí es irrelevante porque en react solo se hace jwt.decode()
    );

    // Obligamos a que la página asigne la sesión antes de cargar el DOM (hydrate)
    await page.addInitScript((token: string) => {
        window.localStorage.setItem('token', token);
    }, fakeToken);
}

test.describe('Autenticación y Roles de Usuario', () => {

    test('1. Flujo de un Estudiante / Alumno', async ({ page }) => {
        // Configuramos la sesión como alumno
        await setRoleContext(page, { name: 'Juan Alumno', staff: false, admin: false });
        
        await page.goto('/');
        
        // Verificaciones de lo que DEBE VER
        await expect(page.locator('text=Bienvenido, Juan')).toBeVisible();
        await expect(page.locator('text=Nueva Reservación')).toBeVisible();
        await expect(page.locator('text=Mis Reservas').first()).toBeVisible();

        // Verificaciones de lo que NO DEBE VER (Protecciones)
        await expect(page.locator('text=Panel de Administración')).not.toBeVisible();
        await expect(page.locator('text=Estadísticas')).not.toBeVisible();
    });

    test('2. Flujo de un Maestro / Staff', async ({ page }) => {
        // Configuramos la sesión como Maestro
        await setRoleContext(page, { name: 'Profesor X', staff: true, admin: false });
        
        await page.goto('/');
        
        // El maestro debe ver básicamente lo mismo que un alumno en el Dashboard, 
        // pero NO debe ver las características exclusivas de administrador.
        await expect(page.locator('text=Bienvenido, Profesor')).toBeVisible();
        await expect(page.locator('text=Mis Reservas').first()).toBeVisible();
        
        // No debe ver lo de admin
        await expect(page.locator('text=Panel de Administración')).not.toBeVisible();
        await expect(page.locator('text=Estadísticas')).not.toBeVisible();
    });

    test('3. Flujo de un Administrador', async ({ page }) => {
        // Configuramos la sesión como Admin
        await setRoleContext(page, { name: 'Súper Admin', staff: true, admin: true });
        
        await page.goto('/');
        
        // El administrador debe ver su saludo especial y los módulos ocultos
        await expect(page.locator('text=Panel de Administración')).toBeVisible();
        await expect(page.locator('text=Estadísticas')).toBeVisible();

        // No debe ver el saludo clásico de alumnos
        await expect(page.locator('text=Bienvenido, Súper Admin')).not.toBeVisible();
    });

});
