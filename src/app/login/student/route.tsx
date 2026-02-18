import { LoginRequest } from "@/lib/promisd";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { id, pwdHash }: LoginRequest = await req.json();
    if (id == "2020100" && pwdHash == "7d987b1801844192c274eb59a37ead5b8fa5b7e2a003d2793e8cb0e0f10e0e440923c3f177184de3c00b1d4321a5376a737fada159f2ed5b46773ea962c92303")
        return new NextResponse(JSON.stringify({
                id,
                name: "Sample Student",
                token: jwt.sign({ id, name: "Sample Staff", admin: false, staff: false }, "samplesecretkey"),
                admin: false,
                staff: false
        }));
    return new Response("null", {status: 403});
};