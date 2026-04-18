import { NextRequest, NextResponse } from "next/server";
import { verifyServerSession } from "@/lib/auth";
import sb from "@/lib/.env/sb";

interface UserData {
    id: string,
    nombre: string
};

export const GET = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization")) as UserData;
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }

    const rs = await sb.schema("public").from("reservas").select("cancelled,day,from,to,sala,sala_data(location,type,number,down,cupo)")
        .eq("user", validPayload.id)
        .order("cancelled", {ascending: true})
        .order("day", {ascending: true})
        .order("from", {ascending: true})
        .order("to", {ascending: true});

    if (rs.error) return new NextResponse(JSON.stringify({error: rs.error}), {status: 500});

    return new NextResponse(JSON.stringify(rs.data));
};