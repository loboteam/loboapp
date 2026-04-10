import { LoginRequest } from "@/lib/promisd";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { id, pwdHash }: LoginRequest = await req.json();
    if (id == "2020200" && pwdHash == "e0a2e959c1f3abff81a13a6cc60c7fe69c33026431de5dfca3e39f724790bb2c09678ba0a372b7b64c2bca4f0e143c326e065bd67a5c281685e2d2d54d60a08a")
        return new NextResponse(JSON.stringify({
                id,
                name: "Sample Staff",
                token: jwt.sign({ id, name: "Sample Staff", admin: false, staff: true }, process.env.JWT_SECRET || "samplesecretkey", { expiresIn: "2h" }),
                admin: false,
                staff: true
        }));
    if (id == "2020555" && pwdHash == "c19b191f9f49a2f26976962355513de43636c188a4b4db10d5798862e49f03bb60e637fac453135270c4bd0b881a697aab9d2d721a7186dec50c511c31ecfaed")
        return new NextResponse(JSON.stringify({
                id,
                name: "Sample Admin",
                token: jwt.sign({ id, name: "Sample Admin", admin: true, staff: true }, process.env.JWT_SECRET || "samplesecretkey", { expiresIn: "2h" }),
                admin: true,
                staff: true
        }));
    return new Response("null", {status: 403});
};