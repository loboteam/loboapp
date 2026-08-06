# Política de Protección de Datos Personales — LoboApp

Este documento complementa el [Aviso de Privacidad](aviso-privacidad.md) y describe los principios y mecanismos concretos que LoboApp aplica para proteger los datos personales de sus usuarios, en línea con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).

## Consentimiento informado

LoboApp no recaba ni procesa datos personales de un usuario sin su consentimiento expreso. En la pantalla de registro, el usuario debe marcar explícitamente dos casillas de verificación —una para el Aviso de Privacidad y otra para esta Política de Protección de Datos Personales— antes de poder crear su cuenta. Ambos documentos son accesibles con un clic desde la propia pantalla de registro.

## Finalidad y minimización de datos

Solo se recaban los datos estrictamente necesarios para operar la cuenta y el servicio de reservación de espacios: nombre completo, número de matrícula, correo institucional y contraseña (transmitida como hash). No se solicita ni almacena información adicional no relacionada con este propósito.

## Seguridad de los datos

- La contraseña se convierte a un hash SHA-512 en el navegador antes de enviarse al servidor; nunca viaja ni se almacena en texto plano.
- Los endpoints que reciben datos personales validan tipo y longitud de cada campo antes de procesarlos.
- El acceso a funciones administrativas está restringido por rol.

## Derechos ARCO

El usuario puede solicitar en cualquier momento el Acceso, Rectificación, Cancelación u Oposición al tratamiento de sus datos personales, así como revocar su consentimiento, contactando a soporte de LoboApp desde la aplicación.

## Retención y eliminación de datos

Los datos personales se conservan únicamente mientras la cuenta esté activa o mientras exista una obligación legal de conservarlos. Al cancelarse una cuenta, los datos personales asociados se eliminan una vez que ya no son necesarios para la finalidad original.

## Notificación de brechas de seguridad

Ante cualquier incidente que comprometa la confidencialidad, integridad o disponibilidad de los datos personales de los usuarios y que pueda afectar de forma significativa sus derechos patrimoniales o morales, LoboApp notificará a los usuarios afectados de manera inmediata, respetando los plazos que marca la LFPDPPP.

## Dónde vive esto en el código

| Punto del checklist | Dónde vive |
|---|---|
| Consentimiento explícito con casillas de verificación | `src/components/min/register.tsx` (`RegisterConsent`) |
| Documentos accesibles con un clic | `Modal` en `src/components/min/legacygeneric.tsx`, invocado desde `RegisterConsent` |
| Finalidad limitada / minimización de datos | Campos del formulario en `src/components/min/register.tsx` (`RegisterFields`) — solo nombre, matrícula, correo y contraseña |
| Validación de consentimiento también en servidor | `src/app/api/register/route.ts` (rechaza con `400` si `acceptsPrivacyPolicy` o `acceptsDataProtection` no son `true`) |
| Hash de contraseña antes de transmitirla | `src/stores/register.tsx` (`sha512(pwd)` antes del `fetch`) |

Ver también [10-proteccion-datos-personales-registro.md](../seguridad/10-proteccion-datos-personales-registro.md) para el detalle técnico completo de la implementación.
