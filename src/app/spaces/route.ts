import { NextRequest, NextResponse } from "next/server";
import sb from "@/lib/.env/sb"

const PAGINATION_SIZE = 5;

export const GET = async (req: NextRequest) => {
    if (((req.nextUrl.searchParams.get("page")?.length ?? false) && req.nextUrl.searchParams.get("page")?.length! > 3) || ((req.nextUrl.searchParams.get("type")?.length ?? false) && req.nextUrl.searchParams.get("type")?.length! > 25) ||
        ((req.nextUrl.searchParams.get("cupo")?.length ?? false) && req.nextUrl.searchParams.get("cupo")?.length! > 3)) return new Response("Malformed.", { status: 400 });

    const page = parseInt(req.nextUrl.searchParams.get("page") || "0");
    const type = req.nextUrl.searchParams.get("type") || "";
    const cupo = parseInt(req.nextUrl.searchParams.get("cupo") || "0");
    return new NextResponse(JSON.stringify(
        (await sb.from("sala_data").select().range(page * PAGINATION_SIZE, (page + 1) * PAGINATION_SIZE - 1)
            .ilike("type", `%${type}%`)
            .gte("cupo", cupo)
            .order("type", {ascending: false}).order("number",{ascending: true})).data
    ))
};