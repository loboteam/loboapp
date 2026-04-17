import { NextRequest, NextResponse } from "next/server";
import { verifyServerSession } from "@/lib/auth";
import sb from "@/lib/.env/sb";

export const GET = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization")) as Yooser;
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }
    // servidor ya firmó token incluyendo parámetro de 'admin'; si la d.ha corresponde a la entereza del token, todo bien,

    const tipo = await sb.schema("public").from("tipos").select('value: tid, label: nombre');
    const edif = await sb.schema("public").from("edificios").select('value: eid, label: eid');

    if (tipo.error || edif.error) return new NextResponse(JSON.stringify(rs.error), {status: 500});

    return new NextResponse(JSON.stringify({tipo: tipo.data, edif: edif.data}));
};
