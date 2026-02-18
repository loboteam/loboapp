import { LoginRequest } from "@/lib/promisd";
import jwt from "jsonwebtoken";

export const POST = async(req: Request) => {
    const {id, pwdHash}: LoginRequest = await req.json();
    if (id == "2020200" && pwdHash == "e0a2e959c1f3abff81a13a6cc60c7fe69c33026431de5dfca3e39f724790bb2c09678ba0a372b7b64c2bca4f0e143c326e065bd67a5c281685e2d2d54d60a08a")
        return new Response(JSON.stringify({
            id,
            name: "Sample Staff",
            token: jwt.sign({id, name: "Sample Staff", admin: false}, "samplesecretkey"),
            admin: false
        }));
    return new Response("null", {status: 403});
};