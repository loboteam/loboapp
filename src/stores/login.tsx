"use client";
import { ENDPOINTS } from "@/lib/constants";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { User, useUser } from "@/stores/user";
import { localSet, sha512 } from "@/lib/promisd";
import jwt from "jsonwebtoken";

type LoginContextContainer = {
    id?: number | string,
    pwd?: string,
    perma: boolean,
    isLogging: boolean,
    setId: Dispatch<SetStateAction<string>>,
    setPwd: Dispatch<SetStateAction<string>>,
    setPerma: Dispatch<SetStateAction<boolean>>,
    logIn: (staff?: boolean) => Promise<void> | undefined,
};

export const LoginContext_Bare = createContext<LoginContextContainer | null>(null);
const LoginContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setUser } = useUser();
    const [id, setId] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [perma, setPerma] = useState<boolean>(false);
    const [isLogging, setLogging] = useState<boolean>(false);
    const logIn = (staff: boolean=false) => {
        if (isLogging) return;
        if (id.length > 1 && pwd.length > 1) {
            setLogging(true);
            return sha512(pwd).then(pwdHash => fetch(ENDPOINTS.login[staff ? "staff" : "student"], { method: "POST", body: JSON.stringify({ id, pwdHash }) })).then(r => r.json()).then((r: User | undefined) => {
                setUser(r);
                if (perma) localSet("token", r?.token)
            }).catch(e => console.error("Ack! Bad login action! Got: ", e)).finally(()=>setLogging(false));
        }
       throw new Error("incomplete login info!");
    }

    return <LoginContext_Bare.Provider value={{id, setId, pwd, setPwd, logIn, perma, setPerma, isLogging}}>{children}</LoginContext_Bare.Provider>
};

export const useLogin = () => {
    const ctx = useContext(LoginContext_Bare);
    if (!ctx) throw new Error("can't get user context outside user context");
    return ctx;
};

export default LoginContext;