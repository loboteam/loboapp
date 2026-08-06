# 7. Prevención de SQL injection vía el query builder de Supabase

## ¿Qué es?

La inyección SQL ocurre cuando un input de usuario se concatena directamente dentro de una cadena de SQL que luego se ejecuta tal cual, permitiendo a un atacante alterar la consulta (por ejemplo, `' OR '1'='1`). La forma estándar de evitarlo es **nunca construir SQL a mano con strings de usuario**, sino usar consultas parametrizadas o un *query builder* que separe los datos de la estructura de la consulta. LoboApp nunca escribe SQL crudo: toda interacción con la base de datos pasa por el cliente JS de Supabase (`@supabase/supabase-js`), que internamente traduce las llamadas a peticiones HTTP parametrizadas contra PostgREST.

## Dónde vive en LoboApp

### Búsqueda en lenguaje natural → filtros → query

`src/app/api/search/route.ts`, líneas 71-79:

```typescript
let query = sb.from("sala_data").select();
if (filters.type) query = query.ilike("type", `%${filters.type}%`);
if (filters.cupo_min) query = query.gte("cupo", filters.cupo_min);
if (filters.cupo_max) query = query.lte("cupo", filters.cupo_max);
if (filters.edif) query = query.ilike("location", `%${filters.edif}%`);

const { data, error } = await query
    .order("type", { ascending: false })
    .order("number", { ascending: true });
```

### Listado paginado de salas

`src/app/spaces/route.tsx`, líneas 22-29:

```typescript
let query = sb.from("sala_data").select()
    .range(page * PAGINATION_SIZE, (page + 1) * PAGINATION_SIZE - 1)
    .ilike("type", `%${type}%`)
    .gte("cupo", cupo);

if (edif) query = query.ilike("location", `%${edif}%`);

const { data } = await query.order("type", { ascending: false }).order("number", { ascending: true });
```

## Cómo funciona paso a paso

1. `sb.from("sala_data")` no construye un string SQL: devuelve un *builder* de PostgREST. El nombre de la tabla (`"sala_data"`) está fijo en el código, nunca proviene de un input del usuario.
2. Métodos como `.ilike("type", \`%${filters.type}%\`)`, `.gte("cupo", filters.cupo_min)`, `.eq(...)` no insertan el valor (`filters.type`, `filters.cupo_min`) dentro de una cadena SQL. La interpolación con backticks (`` `%${filters.type}%` ``) ocurre **en JavaScript**, antes de llegar a Supabase: el resultado es simplemente el *valor del parámetro* `type` que se le pasa al método `.ilike()`. Ese valor viaja como parámetro de filtro en la petición HTTP a PostgREST (por ejemplo, como query string `type=ilike.*texto*`), no como texto que se pega dentro de una sentencia SQL.
3. PostgREST (el servidor que expone Supabase por HTTP) toma esos parámetros y construye la consulta SQL real usando *prepared statements* en el motor de PostgreSQL — la separación entre "estructura de la consulta" y "valor del filtro" ocurre en una capa que el código de LoboApp ni siquiera controla directamente, lo cual es justamente la propiedad que previene la inyección.
4. Por eso, aunque visualmente `` `%${filters.type}%` `` *parece* una concatenación de strings riesgosa, no lo es en la práctica: nunca se construye una sentencia SQL como texto en ningún punto del flujo.

## Qué protege / qué riesgo mitiga

- Un valor malicioso en `filters.type` (por ejemplo, algo como `' ; DROP TABLE sala_data; --`) viajaría como un valor de filtro literal — Supabase buscaría salas cuyo `type` contenga ese texto exacto (probablemente cero resultados), no ejecutaría ningún comando SQL adicional.
- Como el nombre de la tabla (`sala_data`) y las columnas (`type`, `cupo`, `location`, `number`) están todos hardcodeados en el código (nunca se construyen dinámicamente a partir de un input), tampoco hay riesgo de que un usuario controle *qué tabla o columna* se consulta.

### Una nota importante sobre la *secret key* usada aquí

El cliente `sb` (`src/lib/.env/sb.js`, ver [02](02-proteccion-secretos-gitignore-github.md)) se inicializa con una *secret key* de Supabase (prefijo `sb_secret_`), que es el tipo de clave con privilegios elevados — a diferencia de la *anon/public key*, una *secret key* **bypassa Row Level Security (RLS)** y tiene acceso completo a la base de datos. Esto es seguro únicamente porque ese cliente se importa solo desde código que corre exclusivamente en el servidor:

```
$ grep -rn "lib/.env/sb" src
src/app/api/search/route.ts:3:import sb from "@/lib/.env/sb";
src/app/spaces/route.tsx:2:import sb from "@/lib/.env/sb"
```

Ambos son **Route Handlers** (`route.ts` / `route.tsx` dentro de `src/app/.../`), que en Next.js siempre se ejecutan en el servidor y nunca se incluyen en el JavaScript que se envía al navegador. Ningún componente `'use client'` importa `sb` directamente — si lo hiciera, la *secret key* terminaría expuesta en el bundle del navegador, visible para cualquiera que abra las herramientas de desarrollador.

## Limitaciones actuales y recomendaciones

- No hay archivos `.sql` ni migraciones en el repositorio, así que no es posible confirmar desde el código si la tabla `sala_data` tiene **Row Level Security (RLS)** habilitado en el proyecto de Supabase. Como el cliente usado aquí es la *secret key* (que ignora RLS de todas formas), esto no afecta a estos dos endpoints — pero si en el futuro se usa la *anon key* desde algún componente cliente para leer Supabase directamente (sin pasar por un Route Handler), **sí** sería indispensable tener RLS configurado en el panel de Supabase, o cualquier usuario podría leer/escribir la tabla completa con la *anon key* pública.
- Recomendación: documentar (o revisar en el dashboard de Supabase → Authentication → Policies) qué políticas de RLS existen hoy en `sala_data`, para que quede explícito si la única barrera de acceso a esa tabla es "nadie más tiene la *secret key*" (aceptable mientras todo el acceso pase por Route Handlers) o si además hay una capa de RLS independiente.
