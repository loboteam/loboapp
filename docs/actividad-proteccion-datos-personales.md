# Actividad: Protección de Datos Personales (LFPDPPP) — LoboApp

Resumen de lo que pide la actividad, el checklist de cumplimiento y qué se implementó en el proyecto.

## 1. Checklist de cumplimiento (LFPDPPP)

| Punto | Pregunta | Estado | Evidencia |
|---|---|---|---|
| **Consentimiento informado** | ¿Se solicita consentimiento explícito para recopilar y procesar datos? | ✅ | Dos casillas obligatorias en `/registro`: `src/components/min/register.tsx` (`RegisterConsent`) |
| | ¿La información se presenta de forma clara y accesible? | ✅ | Botón "(ver documento)" abre el texto completo en un `Modal` sin salir de la pantalla |
| **Finalidad de la recopilación** | ¿Está definida y limitada la finalidad? | ✅ | Documentada en [docs/legal/proteccion-datos-personales.md](legal/proteccion-datos-personales.md) — crear cuenta, autenticar, gestionar reservaciones |
| | ¿Los datos son estrictamente necesarios? | ✅ | Solo se piden nombre, matrícula, correo y contraseña (`RegisterFields`) |
| **Seguridad de datos** | ¿Hay medidas de seguridad adecuadas? | ⚠️ Parcial | Hash SHA-512 de contraseña en cliente (igual que login, ver [04](seguridad/04-hashing-contrasenas-cliente.md)); falta hash también en servidor |
| | ¿Se usa cifrado para transmisión/almacenamiento de datos sensibles? | ⚠️ Parcial | Ver limitación anterior; no hay persistencia real todavía |
| **Derechos ARCO** | ¿Los usuarios pueden acceder/modificar sus datos? | ❌ Pendiente | No hay UI de perfil para esto aún; el Aviso de Privacidad indica solicitarlo a soporte |
| | ¿Se puede ejercer acceso, rectificación, cancelación y oposición? | ❌ Pendiente | Mismo punto anterior |
| **Retención de datos** | ¿Hay un período de retención definido? | ✅ (documentado) | Descrito en ambos documentos legales: mientras la cuenta esté activa |
| | ¿Se eliminan los datos cuando ya no son necesarios? | ⚠️ Documentado, no implementado | No existe todavía flujo de cancelación de cuenta |
| **Política de privacidad** | ¿Existe una política de privacidad accesible? | ✅ | [docs/legal/aviso-privacidad.md](legal/aviso-privacidad.md), visible desde `/registro` |
| | ¿Describe cómo se recopilan, usan y protegen los datos? | ✅ | Mismo documento |
| **Transferencia de datos** | ¿Se informa sobre transferencias a terceros? | ✅ | El aviso indica que no hay transferencias a terceros |
| | ¿Se obtiene consentimiento antes de transferir? | ✅ (n/a por ahora) | No aplica mientras no haya transferencias; queda documentado el compromiso |
| **Notificación de brechas** | ¿Hay procedimiento para notificar brechas? | ⚠️ Documentado, no automatizado | Compromiso descrito en los documentos legales; sin mecanismo técnico aún |
| | ¿Se cumplen los plazos de la LFPDPPP? | ⚠️ N/A | Depende del procedimiento anterior, hoy manual |

Leyenda: ✅ implementado · ⚠️ parcial/documentado sin automatizar · ❌ pendiente.

## 2. Instrucciones de la actividad y qué se hizo

**"Crear la pantalla de registro... que contenga los apartados para que el usuario pueda aceptar el documento de protección de datos personales y la política de privacidad, debe poder hacer clic para ver estos documentos y la casilla de verificación para aprobarla."**

Hecho. Nueva pantalla en `/registro`:

- `src/app/registro/page.tsx` — ruta de la pantalla.
- `src/components/layout/register.tsx` — composición visual (mismo estilo que `login.tsx`).
- `src/components/min/register.tsx` — campos del formulario + dos casillas de verificación independientes (Aviso de Privacidad y Política de Protección de Datos Personales), cada una con un enlace "(ver documento)" que abre el texto completo en un modal.
- `src/components/min/legalcontent.tsx` — el contenido de ambos documentos que se muestra en el modal.
- `src/stores/register.tsx` — estado del formulario, validación y envío.
- `src/app/api/register/route.ts` — endpoint que también valida el consentimiento del lado del servidor (no confía solo en el cliente).
- Se agregó un enlace "¿No tienes cuenta? Regístrate" en la pantalla de login (`src/components/layout/login.tsx`) para poder llegar a `/registro`.
- Se agregó `ENDPOINTS.register` en `src/lib/constants.tsx`.

**"Actualizar su repositorio con el código agregado."**

Pendiente de commit/push por el equipo (no se hizo commit automáticamente; el código ya está en el working tree, listo para revisar y subir).

**"Subir en su carpeta de equipo la documentación referente a la protección de datos personales y la política de privacidad."**

Documentación agregada en el repo, en `docs/`:

- [docs/legal/aviso-privacidad.md](legal/aviso-privacidad.md) — Aviso de Privacidad completo.
- [docs/legal/proteccion-datos-personales.md](legal/proteccion-datos-personales.md) — Política de Protección de Datos Personales completa.
- [docs/seguridad/10-proteccion-datos-personales-registro.md](seguridad/10-proteccion-datos-personales-registro.md) — detalle técnico de la implementación (dónde vive en el código, cómo funciona paso a paso, limitaciones).
- [docs/seguridad/README.md](seguridad/README.md) — índice y tabla resumen actualizados con el punto 10.

## 3. Limitaciones honestas (para la entrega)

Este es un proyecto académico: el endpoint `/api/register` valida correctamente el consentimiento y los datos, pero **no persiste todavía la cuenta en una base de datos real** ni registra la marca de tiempo del consentimiento. Antes de un uso real en producción faltaría: persistir el consentimiento con evidencia (fecha/hora), hashear la contraseña también en servidor, y construir la UI de derechos ARCO. Estas limitaciones quedan documentadas explícitamente en [10-proteccion-datos-personales-registro.md](seguridad/10-proteccion-datos-personales-registro.md).
