import { NextRequest, NextResponse } from "next/server";
import { verifyServerSession } from "@/lib/auth";
import sb from "@/lib/.env/sb";

interface Yooser {
    id: string
};
interface BookingRequest {
    sala: string,
    day: string,
    from: number,
    to: number
};

export const POST = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization")) as Yooser;
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }

    const b = await req.json() as BookingRequest;

    const rs = await sb.schema("public").from("reservas").insert({user: validPayload.id, ...b});

    if (rs.error) return new NextResponse(JSON.stringify(rs.error), {status: 500});

    return new NextResponse("ok");
};

export const DELETE = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization")) as Yooser;
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }

    if (((req.nextUrl.searchParams.get("sala")?.length ?? 0) !== 36) || ((req.nextUrl.searchParams.get("date")?.length ?? 0) !== 10) || ((req.nextUrl.searchParams.get("from")?.length ?? 0) < 1)) return new Response("Malformed.", { status: 400 });

    const sala = req.nextUrl.searchParams.get("sala"),
        day = req.nextUrl.searchParams.get("date"),
        from = req.nextUrl.searchParams.get("from");

    const d = await sb.schema("public").from("reservas").update({cancelled: true}).eq("user", validPayload.id).eq("day", day).eq("from", from).eq("sala", sala);

    if (d.error) return new NextResponse(JSON.stringify(d.error), {status: 500});

    return new NextResponse("ok");
};