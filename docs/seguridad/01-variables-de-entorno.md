# 1. Variables de entorno

## ¿Qué es?

Las variables de entorno permiten separar **configuración y secretos** (API keys, URLs de servicios externos, credenciales) del código fuente. En vez de escribir un valor sensible directamente en un archivo `.ts`/`.js`, se lee desde `process.env.NOMBRE_VARIABLE` en tiempo de ejecución, y el valor real se define fuera del control de versiones (en un archivo `.env.local`, en la configuración del hosting, en GitHub Secrets, etc.).

## Dónde vive en LoboApp

### Archivo `.env.local` (raíz del proyecto, no versionado)

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

*(el valor real fue enmascarado en este documento — ver [02 - Protección de secretos](02-proteccion-secretos-gitignore-github.md) para confirmar que este archivo nunca se subió a GitHub).*

### Lectura de la variable en el servidor

`src/app/api/search/route.ts`, línea 5:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import sb from "@/lib/.env/sb";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
```

Este archivo es un **Route Handler** de Next.js (`src/app/api/search/route.ts`). Next.js solo carga el contenido de `.env.local` en el proceso de Node.js que ejecuta el servidor — nunca lo inyecta en el bundle de JavaScript que se envía al navegador, **a menos que** la variable tenga el prefijo `NEXT_PUBLIC_`.

`GROQ_API_KEY` no tiene ese prefijo, así que:

- Solo es legible con `process.env.GROQ_API_KEY` dentro de código que corre en el servidor (Route Handlers, Server Components, Server Actions).
- Si alguien intentara usar `process.env.GROQ_API_KEY` dentro de un componente marcado `'use client'`, su valor sería `undefined` en el navegador — Next.js ni siquiera lo incluye en el bundle.

## Cómo funciona paso a paso

1. Al ejecutar `npm run dev` / `npm run build`, Next.js lee automáticamente `.env.local` y carga sus pares `clave=valor` en `process.env`.
2. El Route Handler `POST /api/search` se ejecuta exclusivamente en el servidor (Node.js), nunca en el navegador del usuario.
3. `new Groq({ apiKey: process.env.GROQ_API_KEY })` construye el cliente de Groq usando la key leída de entorno, no una key hardcodeada en el archivo.
4. Si `.env.local` no existe o no define `GROQ_API_KEY`, `process.env.GROQ_API_KEY` sería `undefined` y la librería de Groq fallaría al hacer la petición — es decir, el código está diseñado para depender de la variable de entorno, no de un valor de respaldo embebido.

## Qué protege / qué riesgo mitiga

- Evita que la API key de Groq quede escrita en texto plano dentro de un archivo `.ts` que sí se sube a GitHub.
- Permite usar keys distintas en desarrollo/producción sin tocar código.
- Reduce el riesgo de que un `git grep` o una búsqueda en GitHub (dorking) encuentre la key, porque nunca existió dentro de un archivo versionado.

## Limitaciones actuales y recomendaciones

- **No existe `.env.example`**: no hay un archivo de plantilla (`GROQ_API_KEY=` sin valor) que documente qué variables necesita el proyecto para que otro desarrollador pueda levantarlo. Se recomienda añadir uno.
- **No todas las claves del proyecto usan este patrón**: la *secret key* de Supabase está hardcodeada en `src/lib/.env/sb.js` en vez de leerse con `process.env.SUPABASE_SECRET_KEY` (ver el archivo [02](02-proteccion-secretos-gitignore-github.md) para el detalle de por qué, aun así, no terminó expuesta en GitHub). Lo ideal a futuro es migrar ese archivo también a `process.env`, por dos razones:
  - Si alguien renombra esa carpeta (deja de llamarse `.env`), el archivo dejaría de estar protegido por `.gitignore` y el secreto quedaría expuesto en el próximo commit.
  - Usar `process.env` en ambos casos hace que el manejo de secretos sea consistente en todo el proyecto.
- Una plantilla recomendada para `src/lib/.env/sb.js` sería:

```typescript
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default sb;
```

con `SUPABASE_URL` y `SUPABASE_SECRET_KEY` definidas en `.env.local`.
