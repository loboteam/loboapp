import { NextRequest, NextResponse } from "next/server";
import { verifyServerSession } from "@/lib/auth";
import sb from "@/lib/.env/sb";

export const PUT = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization"));
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }
    // servidor ya firmó token incluyendo parámetro de 'admin'; si la d.ha corresponde a la entereza del token, todo bien,

    if ((req.nextUrl.searchParams.get("sala")?.length ?? 0) !== 36) return new Response("Malformed.", { status: 400 })

    const rs = await sb.schema("public").from("salas").update({down: false}).eq("sid", req.nextUrl.searchParams.get("sala"));

    if (rs.error) return new NextResponse(JSON.stringify(rs.error), {status: 500});

    return new NextResponse("ok");
};

export const DELETE = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization"));
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }
    // servidor ya firmó token incluyendo parámetro de 'admin'; si la d.ha corresponde a la entereza del token, todo bien,

    if ((req.nextUrl.searchParams.get("sala")?.length ?? 0) !== 36) return new Response("Malformed.", { status: 400 })

    const rs = await sb.schema("public").from("salas").update({down: true}).eq("sid", req.nextUrl.searchParams.get("sala"));

    if (rs.error) return new NextResponse(JSON.stringify(rs.error), {status: 500});

    return new NextResponse("ok");
};