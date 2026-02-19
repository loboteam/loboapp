import { NextRequest, NextResponse } from "next/server";
import sb from "@/lib/.env/sb"

const PAGINATION_SIZE = 5;

export const GET = async (req: NextRequest) => {
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