import { NextRequest, NextResponse } from "next/server";
import { verifyServerSession } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
    const validPayload = verifyServerSession(req.headers.get("Authorization"));
    
    if (!validPayload) {
        return new NextResponse(JSON.stringify({ error: "Session expired or invalid token" }), { status: 401 });
    }
    
    return new NextResponse(JSON.stringify({ session: "ok", payload: validPayload }), { status: 200 });
};
