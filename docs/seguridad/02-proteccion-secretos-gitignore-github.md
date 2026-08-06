# 2. Protección de secretos frente a GitHub (.gitignore)

## ¿Qué es?

El repositorio de LoboApp está conectado a un remoto real en GitHub:

```
$ git remote -v
origin  https://github.com/corn-snake/loboapp (fetch)
origin  https://github.com/corn-snake/loboapp (push)
```

Cualquier archivo que se haga `git add` + `git commit` puede terminar publicado ahí. `.gitignore` es la primera línea de defensa para que los secretos (API keys, tokens, certificados) nunca lleguen a ese commit en primer lugar — es mucho más barato evitar el commit que tener que reescribir historia y rotar credenciales después de un push accidental.

## Dónde vive en LoboApp

`.gitignore` (raíz del proyecto):

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

/testing

.env
# Playwright tests
test-results/
playwright-report/
playwright/.cache/
```

## Cómo funciona paso a paso

1. La línea `.env*` (sin `/` al inicio) le dice a Git: "ignora cualquier archivo o **carpeta** llamada `.env` o que empiece con `.env`, en **cualquier nivel** del árbol de directorios", no solo en la raíz.
2. En el proyecto existe `src/lib/.env/sb.js` — una carpeta llamada literalmente `.env` que contiene el cliente de Supabase con la *secret key* hardcodeada:

   `src/lib/.env/sb.js`:
   ```javascript
   import { createClient } from "@supabase/supabase-js";

   const sb = createClient("https://<tu-proyecto>.supabase.co", "<SUPABASE_SECRET_KEY_REDACTED>");

   export default sb;
   ```
   *(la secret key real fue enmascarada en este documento; el archivo original sí la contiene en texto plano)*

3. Como la carpeta se llama `.env`, el patrón `.env*` de `.gitignore` la atrapa completa, incluyendo `sb.js` dentro de ella. Se puede comprobar directamente:

   ```
   $ git check-ignore -v src/lib/.env/sb.js
   .gitignore:45:.env   src/lib/.env/sb.js
   ```

   Esa salida confirma que la regla en la **línea 45** del `.gitignore` (`.env`) es la que está bloqueando ese archivo específico.

4. Y se puede confirmar que, en efecto, nunca fue parte de ningún commit:

   ```
   $ git ls-files | grep sb.js
   (sin resultados)

   $ git log --oneline -- src/lib/.env/sb.js
   (sin resultados)
   ```

   El archivo existe en disco (es necesario para que la app compile localmente) pero **nunca ha existido en el historial de Git**, por lo tanto nunca pudo subirse a `github.com/corn-snake/loboapp`.

5. Lo mismo aplica a `.env.local` (la API key de Groq, ver [01](01-variables-de-entorno.md)): la línea `.env*` también lo cubre, y la línea explícita `.env` (línea 45) actúa como refuerzo adicional.

6. `*.pem` (línea 25) cubre además cualquier certificado o llave privada en formato PEM que se llegara a generar localmente (por ejemplo, para HTTPS en desarrollo), por la misma razón: nunca deben quedar en el historial de Git.

## Qué protege / qué riesgo mitiga

- **Filtración de credenciales en un repositorio público/compartido**: si `corn-snake/loboapp` es público (o se vuelve público, o un colaborador hace fork), cualquier secreto en el historial de Git queda expuesto para siempre, incluso si se borra en un commit posterior — la única forma de remediarlo de verdad es reescribir historia y rotar la credencial. `.gitignore` evita llegar a ese escenario.
- **Bots de scraping de GitHub**: existen bots automatizados que recorren repositorios públicos buscando patrones como `sb_secret_`, `gsk_`, `AKIA` (AWS), etc. Como estos archivos nunca se commitearon, no hay nada que esos bots puedan encontrar en este repo.

## Limitaciones actuales y recomendaciones

- El truco de nombrar una carpeta `.env` para que el wildcard `.env*` la cubra **funciona, pero es implícito y frágil**: depende de que nadie renombre esa carpeta sin saber por qué se llama así. Si alguien la renombra a, por ejemplo, `src/lib/supabase/`, el archivo `sb.js` dejaría de estar ignorado y el siguiente `git add .` lo subiría a GitHub con la secret key en texto plano.
- Recomendación: documentar explícitamente (con un comentario en el propio archivo, o en este mismo set de documentos) *por qué* la carpeta se llama `.env`, y a mediano plazo migrar ese valor a `process.env.SUPABASE_SECRET_KEY` (ver [01](01-variables-de-entorno.md)) para que la protección no dependa del nombre de una carpeta.
- No hay `.github/workflows/` en el proyecto (no hay CI/CD), por lo que no aplica todavía el uso de **GitHub Actions Secrets** (`secrets.MI_VARIABLE` en un workflow). Si en el futuro se agrega un pipeline de CI/CD que necesite la `GROQ_API_KEY` o la *secret key* de Supabase, esos valores deben configurarse en **Settings → Secrets and variables → Actions** del repositorio en GitHub, nunca en el YAML del workflow ni en el código.
- Antes de hacer público este repositorio (si hoy es privado) o de aceptar colaboradores externos, conviene rotar la *secret key* de Supabase y la API key de Groq como medida preventiva, ya que estuvieron en texto plano en disco aunque no en Git.
