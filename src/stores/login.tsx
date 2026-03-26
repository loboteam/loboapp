"use client";
import { ENDPOINTS } from "@/lib/constants";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { User, useUser } from "@/stores/user";
import { localSet, sha512 } from "@/lib/promisd";

type LoginContextContainer = {
    id?: number | string,
    pwd?: string,
    perma: boolean,
    setId: Dispatch<SetStateAction<string>>,
    setPwd: Dispatch<SetStateAction<string>>,
    setPerma: Dispatch<SetStateAction<boolean>>,
    logIn: (staff?: boolean) => Promise<void>,
};

export const LoginContext_Bare = createContext<LoginContextContainer | null>(null);
const LoginContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setUser } = useUser();
    const [id, setId] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [perma, setPerma] = useState<boolean>(false);
    const logIn = (staff: boolean=false) => {
        if (id.length > 1 && pwd.length > 1)
            return sha512(pwd).then(pwdHash => fetch(ENDPOINTS.login[staff ? "staff" : "student"], { method: "POST", body: JSON.stringify({ id, pwdHash }) })).then(r => r.json()).then((r: User | undefined) => {
                setUser(r);
                if (perma) localSet("token", r?.token)
            }).catch(e => console.error("Ack! Bad login action! Got: ", e));
            throw new Error("incomplete login info!");
        }
    return <LoginContext_Bare.Provider value={{id, setId, pwd, setPwd, logIn, perma, setPerma}}>{children}</LoginContext_Bare.Provider>
};

export const useLogin = () => {
    const ctx = useContext(LoginContext_Bare);
    if (!ctx) throw new Error("can't get user context outside user context");
    return ctx;
};

export default LoginContext;