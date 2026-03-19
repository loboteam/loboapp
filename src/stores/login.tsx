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
    logIn: (staff?: boolean) => Promise<void>,
    error: string | null,
    setError: Dispatch<SetStateAction<string | null>>,
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
};

export const LoginContext_Bare = createContext<LoginContextContainer | null>(null);
const LoginContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setUser } = useUser();
    const [id, setId] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [perma, setPerma] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const logIn = async (staff: boolean=false) => {
        if (id.length < 2 || pwd.length < 2) {
            setError("Por favor completa todos los campos");
            throw new Error("incomplete login info!");
        }
        
        setError(null);
        setLoading(true);
        
        try {
            const pwdHash = await sha512(pwd);
            const response = await fetch(ENDPOINTS.login[staff ? "staff" : "student"], { 
                method: "POST", 
                body: JSON.stringify({ id, pwdHash }) 
            });
            
            const data = await response.json();
            
            if (!data || !data.token) {
                setError("Credenciales inválidas. Verifica tu matrícula y contraseña.");
                setLoading(false);
                throw new Error("Invalid credentials");
            }
            
            setUser(data);
            if (perma) localSet("token", data?.token);
            setLoading(false);
        } catch (e: any) {
            const errorMsg = e.message || "Error al iniciar sesión. Intenta de nuevo.";
            setError(errorMsg);
            setLoading(false);
            throw e;
        }
    }

    return <LoginContext_Bare.Provider value={{id, setId, pwd, setPwd, logIn, perma, setPerma, error, setError, loading, setLoading}}>{children}</LoginContext_Bare.Provider>
};

export const useLogin = () => {
    const ctx = useContext(LoginContext_Bare);
    if (!ctx) throw new Error("can't get user context outside user context");
    return ctx;
};

export default LoginContext;