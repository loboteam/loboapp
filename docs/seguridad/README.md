# Medidas de seguridad en LoboApp

LoboApp es una aplicación Next.js (App Router + TypeScript) para reservar espacios universitarios (salas de lectura, laboratorios, salas de descanso). Usa **Supabase** como base de datos, **jsonwebtoken** para sesiones, y **Groq** (LLM) para una búsqueda de salas en lenguaje natural.

Esta carpeta documenta, con fragmentos de código reales del repositorio, las medidas de seguridad que existen **hoy** en el proyecto: qué son, dónde viven en el código, cómo funcionan paso a paso, y qué limitaciones/recomendaciones tienen (es un proyecto académico, así que varias medidas están simplificadas a propósito y se anota explícitamente cuándo es el caso).

> **Nota sobre secretos reales encontrados durante la auditoría:** existen una API key real de Groq (`.env.local`) y una *secret key* real de Supabase (`src/lib/.env/sb.js`) en el código local. Ninguna llegó nunca a GitHub porque `.gitignore` ignora cualquier ruta que contenga `.env` (ver [02](02-proteccion-secretos-gitignore-github.md)). En los fragmentos de código de estos documentos esos valores reales aparecen **enmascarados** (`xxxxxxxx`) para no crear, con esta misma documentación, un nuevo lugar donde queden expuestos si esta carpeta se sube a GitHub.

## Índice

1. [Variables de entorno](01-variables-de-entorno.md) — `process.env`, `.env.local`, separación cliente/servidor.
2. [Protección de secretos y GitHub](02-proteccion-secretos-gitignore-github.md) — `.gitignore`, por qué nada sensible llegó al repo remoto.
3. [Autenticación basada en JWT](03-autenticacion-jwt.md) — `jsonwebtoken`, login de staff/estudiante, sesión.
4. [Hashing de contraseñas en el cliente](04-hashing-contrasenas-cliente.md) — Web Crypto API, SHA-512 antes de viajar por red.
5. [Autorización y control de roles (RBAC)](05-autorizacion-roles-rbac.md) — `IfAdmin`, `IfStaff`, `IfLogged`, etc.
6. [Validación de inputs en endpoints API](06-validacion-inputs-api.md) — `/api/search` y `/spaces`.
7. [Prevención de SQL injection vía Supabase](07-prevencion-sql-injection-supabase.md) — query builder parametrizado, secret key aislada al servidor.
8. [Manejo seguro de errores](08-manejo-seguro-errores.md) — mensajes genéricos, sin stack traces al cliente.
9. [Testing de seguridad con Playwright](09-testing-seguridad-playwright.md) — verificación automatizada de RBAC en la UI.
10. [Consentimiento de protección de datos personales en el registro](10-proteccion-datos-personales-registro.md) — pantalla `/registro`, casillas de consentimiento, validación en cliente y servidor.

## Resumen ejecutivo

| # | Medida | Dónde vive | Estado |
|---|--------|-----------|--------|
| 1 | Variables de entorno | `.env.local`, `process.env.GROQ_API_KEY` | Implementado (parcial) |
| 2 | `.gitignore` / secretos fuera de GitHub | `.gitignore`, `src/lib/.env/sb.js` | Implementado |
| 3 | Autenticación JWT | `src/app/login/{staff,student}/route.tsx`, `src/stores/user.tsx` | Implementado (modo demo) |
| 4 | Hashing de contraseñas en cliente | `src/lib/promisd.ts` (`sha512`) | Implementado |
| 5 | Autorización por roles (RBAC en UI) | `src/stores/user.tsx`, `src/app/page.tsx` | Implementado (solo cliente) |
| 6 | Validación de inputs | `src/app/api/search/route.ts`, `src/app/spaces/route.tsx` | Implementado |
| 7 | Prevención de SQL injection | Supabase query builder (`sb.from(...).ilike/eq/gte/lte`) | Implementado |
| 8 | Manejo seguro de errores | `route.ts` / `route.tsx` de cada endpoint | Implementado (parcial) |
| 9 | Testing de seguridad (RBAC) | `tests/roles.spec.ts` (Playwright) | Implementado |
| 10 | Consentimiento de protección de datos personales | `src/app/registro/page.tsx`, `src/components/min/register.tsx`, `src/app/api/register/route.ts` | Implementado (registro es un endpoint de demostración, sin persistencia real) |

Cada documento incluye al final una sección **"Limitaciones actuales y recomendaciones"** que es deliberadamente honesta: el objetivo es explicar qué hace el código *de verdad*, no exagerar su robustez.

Los documentos legales (Aviso de Privacidad y Política de Protección de Datos Personales) mostrados en la pantalla de registro viven en [docs/legal/](../legal/).
