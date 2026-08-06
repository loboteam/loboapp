# Aviso de Privacidad — LoboApp

Este Aviso de Privacidad se emite en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.

## Responsable del tratamiento

LoboApp, sistema de reservación de espacios universitarios, es responsable del tratamiento de los datos personales que se recaban a través de la pantalla de registro y del resto de la aplicación.

## Datos personales que se recaban

Al crear una cuenta en LoboApp se recaban los siguientes datos:

- Nombre completo.
- Número de matrícula.
- Correo institucional.
- Contraseña (nunca se almacena ni transmite en texto plano; se envía como *hash* SHA-512 desde el navegador, ver [04-hashing-contrasenas-cliente.md](../seguridad/04-hashing-contrasenas-cliente.md)).

No se recaban datos personales sensibles (origen étnico, salud, creencias religiosas, etc.).

## Finalidad del tratamiento

Los datos se utilizan exclusivamente para:

1. Crear y administrar la cuenta del usuario.
2. Autenticar al usuario en accesos posteriores.
3. Gestionar sus reservaciones de espacios dentro del campus (salas de lectura, laboratorios, salas de descanso).

Los datos recabados son los estrictamente necesarios para estas finalidades; no se solicita información adicional.

## Transferencia de datos

LoboApp no transfiere datos personales a terceros. En caso de que en el futuro fuera necesaria alguna transferencia, se informará a los usuarios y se solicitará su consentimiento previo, salvo las excepciones previstas por el artículo 37 de la LFPDPPP.

## Derechos ARCO

El usuario puede en cualquier momento ejercer sus derechos de **A**cceso, **R**ectificación, **C**ancelación u **O**posición (ARCO) sobre sus datos personales, así como revocar el consentimiento otorgado, a través de la sección de soporte de la aplicación.

## Retención de datos

Los datos personales se conservan mientras la cuenta del usuario permanezca activa. Si el usuario solicita la cancelación de su cuenta, sus datos se eliminan una vez que dejan de ser necesarios para la finalidad descrita o para cumplir alguna obligación legal.

## Seguridad de los datos

Se aplican medidas técnicas y administrativas para proteger los datos personales, entre ellas:

- Hash de contraseñas del lado del cliente antes de su transmisión (ver [04](../seguridad/04-hashing-contrasenas-cliente.md)).
- Control de acceso basado en roles (ver [05](../seguridad/05-autorizacion-roles-rbac.md)).
- Validación de datos de entrada en los endpoints que procesan información del usuario (ver [06](../seguridad/06-validacion-inputs-api.md)).

## Notificación de brechas de seguridad

En caso de una vulneración de seguridad, en cualquier fase del tratamiento, que afecte de forma significativa los derechos patrimoniales o morales de los usuarios, LoboApp notificará a los afectados de forma inmediata, conforme a los plazos y condiciones establecidos en la LFPDPPP.

## Cambios al aviso de privacidad

Cualquier modificación a este Aviso de Privacidad se publicará en esta misma ubicación y será accesible desde la pantalla de registro de la aplicación.

## Consentimiento

Al marcar la casilla "He leído y acepto el Aviso de Privacidad" en la pantalla de registro, el usuario manifiesta su consentimiento libre, específico e informado para el tratamiento de sus datos personales conforme a lo aquí descrito.
