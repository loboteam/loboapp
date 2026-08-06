import React from "react";

export const PRIVACY_POLICY: React.ReactNode = <div className="space-y-3 text-sm text-gray-700">
    <p><strong>Responsable:</strong> LoboApp, sistema de reservación de espacios universitarios, es el responsable del tratamiento de los datos personales que nos proporcionas, en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
    <p><strong>Datos que recabamos:</strong> nombre completo, número de matrícula, correo institucional y contraseña (almacenada como hash, nunca en texto plano).</p>
    <p><strong>Finalidad:</strong> crear y administrar tu cuenta, autenticarte de forma segura, y gestionar tus reservaciones de espacios dentro del campus. No usamos tus datos para fines distintos a estos.</p>
    <p><strong>Transferencia de datos:</strong> tus datos personales no se transfieren a terceros. Si en el futuro fuera necesaria alguna transferencia, se te notificará y se solicitará tu consentimiento previo.</p>
    <p><strong>Derechos ARCO:</strong> puedes acceder, rectificar, cancelar u oponerte (ARCO) al tratamiento de tus datos personales en cualquier momento desde tu perfil o escribiendo a soporte de LoboApp.</p>
    <p><strong>Seguridad:</strong> tu contraseña se transmite y almacena únicamente en forma de hash (SHA-512 antes de viajar por la red); aplicamos medidas técnicas razonables para proteger tu información.</p>
    <p><strong>Notificación de brechas de seguridad:</strong> en caso de una vulneración de seguridad que afecte de forma significativa tus derechos patrimoniales o morales, se te notificará de forma inmediata, conforme a lo establecido por la LFPDPPP.</p>
    <p><strong>Cambios al aviso:</strong> cualquier modificación a este aviso de privacidad se publicará en esta misma sección de la aplicación.</p>
</div>;

export const DATA_PROTECTION_NOTICE: React.ReactNode = <div className="space-y-3 text-sm text-gray-700">
    <p><strong>Consentimiento informado:</strong> al marcar la casilla correspondiente y crear tu cuenta, otorgas tu consentimiento expreso e informado para que LoboApp recabe y trate tus datos personales conforme a lo descrito en este documento y en el Aviso de Privacidad.</p>
    <p><strong>Principio de finalidad:</strong> los datos que recabamos (nombre, matrícula, correo institucional y contraseña) se limitan estrictamente a lo necesario para operar tu cuenta y el servicio de reservación de espacios; no se recopila información adicional no relacionada con este propósito.</p>
    <p><strong>Retención de datos:</strong> conservamos tus datos personales mientras tu cuenta permanezca activa. Si solicitas la cancelación de tu cuenta, tus datos se eliminan una vez que ya no son necesarios para cumplir la finalidad descrita o alguna obligación legal aplicable.</p>
    <p><strong>Ejercicio de derechos ARCO:</strong> puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos personales en cualquier momento; atenderemos tu solicitud dentro de los plazos establecidos por la LFPDPPP.</p>
    <p><strong>Medidas de seguridad:</strong> implementamos medidas administrativas y técnicas (como el uso de hash para contraseñas y control de acceso por roles) para proteger tus datos personales contra daño, pérdida, alteración, acceso o uso no autorizado.</p>
    <p><strong>Contacto:</strong> para cualquier duda sobre el tratamiento de tus datos personales o para ejercer tus derechos ARCO, contacta a soporte de LoboApp desde la sección de ayuda de la aplicación.</p>
</div>;
