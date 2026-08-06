import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json().catch(() => null);

    if (!body?.name || typeof body.name !== "string" || body.name.length > 100) {
        return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    if (!body?.id || typeof body.id !== "string" || body.id.length > 15) {
        return NextResponse.json({ error: "Matrícula inválida" }, { status: 400 });
    }
    if (!body?.email || typeof body.email !== "string" || body.email.length > 150 || !body.email.includes("@")) {
        return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }
    if (!body?.pwdHash || typeof body.pwdHash !== "string" || body.pwdHash.length !== 128) {
        return NextResponse.json({ error: "Contraseña inválida" }, { status: 400 });
    }
    if (body.acceptsPrivacyPolicy !== true || body.acceptsDataProtection !== true) {
        return NextResponse.json({ error: "Debes aceptar el Aviso de Privacidad y la Política de Protección de Datos Personales para registrarte." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
};
