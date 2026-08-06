# 10. Consentimiento de protección de datos personales en el registro

## ¿Qué es?

La LFPDPPP exige que, antes de recabar datos personales, el usuario otorgue su **consentimiento informado**: debe conocer qué datos se recaban, para qué, y aceptarlo explícitamente. La pantalla de registro de LoboApp implementa esto con dos casillas de verificación obligatorias —Aviso de Privacidad y Política de Protección de Datos Personales— que el usuario puede leer con un clic antes de aceptarlas, y sin las cuales no puede crear una cuenta.

Los documentos en sí (el texto legal) viven en [docs/legal/](../legal/): [aviso-privacidad.md](../legal/aviso-privacidad.md) y [proteccion-datos-personales.md](../legal/proteccion-datos-personales.md).

## Dónde vive en LoboApp

- `src/app/registro/page.tsx` — ruta `/registro`, la pantalla de registro.
- `src/components/layout/register.tsx` — composición completa de la pantalla.
- `src/components/min/register.tsx` — campos del formulario y casillas de consentimiento (`RegisterConsent`).
- `src/components/min/legalcontent.tsx` — contenido de los dos documentos, mostrado en un `Modal` al hacer clic en "(ver documento)".
- `src/stores/register.tsx` — estado del formulario y lógica de envío (`RegisterContext`, `useRegister`).
- `src/app/api/register/route.ts` — endpoint que valida los datos y el consentimiento del lado del servidor.

## Cómo funciona paso a paso

1. El usuario llena nombre, matrícula, correo y contraseña (`RegisterFields`, `src/components/min/register.tsx`).
2. Debe marcar dos casillas independientes, una por documento (`ConsentCheckbox` dentro de `RegisterConsent`). Cada casilla tiene un botón "(ver documento)" que abre un `Modal` (reutilizando `src/components/min/legacygeneric.tsx`) con el texto completo del Aviso de Privacidad o de la Política de Protección de Datos Personales — el usuario puede leerlos sin salir de la pantalla de registro.
3. El botón "Crear cuenta" (`RegisterButton`) está **deshabilitado** mientras `acceptsPrivacyPolicy` o `acceptsDataProtection` sean `false`:

   ```tsx
   // src/components/min/register.tsx
   export const RegisterButton: React.FC = () => {
       const { register, acceptsPrivacyPolicy, acceptsDataProtection } = useRegister();
       const efun = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { e.preventDefault(); register(); };
       return <Button onClick={efun} disabled={!acceptsPrivacyPolicy || !acceptsDataProtection} className="w-full">
           Crear cuenta
       </Button>;
   };
   ```

4. Antes de enviar la petición, `register()` (`src/stores/register.tsx`) vuelve a comprobar en el cliente que ambas casillas estén aceptadas, y solo entonces hashea la contraseña (SHA-512, igual que en el login — ver [04](04-hashing-contrasenas-cliente.md)) y hace `POST` a `/api/register`.
5. El endpoint (`src/app/api/register/route.ts`) **no confía en la validación del cliente** y vuelve a rechazar la petición si el consentimiento no llegó en `true`:

   ```typescript
   if (body.acceptsPrivacyPolicy !== true || body.acceptsDataProtection !== true) {
       return NextResponse.json({ error: "Debes aceptar el Aviso de Privacidad y la Política de Protección de Datos Personales para registrarte." }, { status: 400 });
   }
   ```

   Esto sigue el mismo patrón de validación de inputs que ya existe en `/api/search` y `/spaces` (ver [06](06-validacion-inputs-api.md)): cada campo se valida por tipo y longitud antes de usarse, y aquí además se valida el consentimiento como si fuera un campo obligatorio más.

## Qué protege / qué riesgo mitiga

- Evita que se cree una cuenta (y por tanto, que se procesen datos personales) sin que el usuario haya tenido la oportunidad real de leer los documentos y sin un consentimiento explícito registrado en la petición.
- La validación duplicada (cliente + servidor) evita que alguien pueda saltarse el consentimiento llamando directamente a `/api/register` sin pasar por la pantalla.
- Limitar los campos del formulario a nombre, matrícula, correo y contraseña aplica el principio de minimización de datos: solo se recaba lo necesario para la finalidad declarada (crear la cuenta y gestionar reservaciones).

## Limitaciones actuales y recomendaciones

- El endpoint `/api/register` valida y responde `200 OK`, pero **no persiste todavía la cuenta en una base de datos real** (no hay tabla de usuarios en Supabase conectada a este flujo) ni registra la fecha/hora en que se otorgó el consentimiento — es un endpoint de demostración, igual que el login (ver la nota de "modo demo" en el [README](README.md)). Antes de usar este registro en producción habría que: (a) persistir el consentimiento con marca de tiempo (evidencia de que se otorgó), y (b) hashear la contraseña también del lado del servidor (bcrypt/argon2), como ya recomienda [04](04-hashing-contrasenas-cliente.md).
- No hay todavía un mecanismo en la UI para que un usuario ya registrado ejerza sus derechos ARCO (acceso/rectificación/cancelación/oposición) directamente desde su perfil; por ahora el Aviso de Privacidad indica que debe solicitarse a soporte.
- No existe aún un procedimiento automatizado de notificación de brechas de seguridad; los documentos legales describen el compromiso, pero su ejecución seguiría siendo manual.
