import sb from "@/lib/.env/sb";
import { LoginRequest } from "@/lib/promisd";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { id, pwdHash }: LoginRequest = await req.json();
    const res = await sb.schema("public").from("staff").select("id:matricula, name:nombre").eq("matricula", id).eq("phash",pwdHash);
    const isadm = await sb.schema("public").from("admins").select("matricula").eq("is", 'staff').eq("matricula", id);
    if (res.error || res.data?.length !== 1)
        return new Response("null", {status: 403});
    return new NextResponse(JSON.stringify({
            ...(res.data[0]),
            token: jwt.sign({ ...(res.data[0]), admin: (isadm.data?.length ?? 0) > 0, staff: false }, process.env.JWT_SECRET || "samplesecretkey", { expiresIn: "2h" }),
            admin: (isadm.data?.length ?? 0) > 0,
            staff: false
    }));
};