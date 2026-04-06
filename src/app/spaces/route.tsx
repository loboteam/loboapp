import { NextRequest, NextResponse } from "next/server";
import sb from "@/lib/.env/sb"

const PAGINATION_SIZE = 5;

export const GET = async (req: NextRequest) => {
    const pageParam = req.nextUrl.searchParams.get("page");
    const typeParam = req.nextUrl.searchParams.get("type");
    const cupoParam = req.nextUrl.searchParams.get("cupo");
    const edifParam = req.nextUrl.searchParams.get("edif");

    if ((pageParam?.length ?? 0) > 3) return new Response("Malformed.", { status: 400 });
    if ((typeParam?.length ?? 0) > 25) return new Response("Malformed.", { status: 400 });
    if ((cupoParam?.length ?? 0) > 3) return new Response("Malformed.", { status: 400 });
    if ((edifParam?.length ?? 0) > 30) return new Response("Malformed.", { status: 400 });

    const page = parseInt(pageParam || "0");
    const type = typeParam || "";
    const cupo = parseInt(cupoParam || "0");
    const edif = edifParam || "";

    let query = sb.from("sala_data").select()
        .range(page * PAGINATION_SIZE, (page + 1) * PAGINATION_SIZE - 1)
        .ilike("type", `%${type}%`)
        .gte("cupo", cupo);

    if (edif) query = query.ilike("location", `%${edif}%`);

    const { data } = await query.order("type", { ascending: false }).order("number", { ascending: true });

    return new NextResponse(JSON.stringify(data));
};
