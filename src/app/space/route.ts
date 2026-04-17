import { NextRequest, NextResponse } from "next/server";
import { verifyServerSession } from "@/lib/auth";
import sb from "@/lib/.env/sb";

interface SpaceRequest {
    tipo: number,
    edif: string,
    cupo: number,
    of_edif: number,
    abre: number,
    cierra: number
};

export const POST = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization"));
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }
    // servidor ya firmó token incluyendo parámetro de 'admin'; si la d.ha corresponde a la entereza del token, todo bien,

    const b = await req.json() as SpaceRequest;

    const rs = await sb.schema("public").from("salas").insert({...b}).select("sid");

    if (rs.error) return new NextResponse(JSON.stringify(rs.error), {status: 500});

    return new NextResponse(rs.data[0].sid);
};