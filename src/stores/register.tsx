"use client";
import { ENDPOINTS } from "@/lib/constants";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { sha512 } from "@/lib/promisd";

type RegisterContextContainer = {
    name: string,
    setName: Dispatch<SetStateAction<string>>,
    id: string,
    setId: Dispatch<SetStateAction<string>>,
    email: string,
    setEmail: Dispatch<SetStateAction<string>>,
    pwd: string,
    setPwd: Dispatch<SetStateAction<string>>,
    confirmPwd: string,
    setConfirmPwd: Dispatch<SetStateAction<string>>,
    acceptsPrivacyPolicy: boolean,
    setAcceptsPrivacyPolicy: Dispatch<SetStateAction<boolean>>,
    acceptsDataProtection: boolean,
    setAcceptsDataProtection: Dispatch<SetStateAction<boolean>>,
    error: string,
    success: boolean,
    register: () => Promise<void>,
};

export const RegisterContext_Bare = createContext<RegisterContextContainer | null>(null);
const RegisterContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [acceptsPrivacyPolicy, setAcceptsPrivacyPolicy] = useState(false);
    const [acceptsDataProtection, setAcceptsDataProtection] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const register = () => {
        setError("");
        setSuccess(false);
        if (name.length < 2 || id.length < 2 || email.length < 5 || pwd.length < 6) {
            setError("Completa todos los campos correctamente.");
            return Promise.resolve();
        }
        if (pwd !== confirmPwd) {
            setError("Las contraseñas no coinciden.");
            return Promise.resolve();
        }
        if (!acceptsPrivacyPolicy || !acceptsDataProtection) {
            setError("Debes aceptar el Aviso de Privacidad y la Política de Protección de Datos Personales para continuar.");
            return Promise.resolve();
        }
        return sha512(pwd)
            .then(pwdHash => fetch(ENDPOINTS.register, {
                method: "POST",
                body: JSON.stringify({ name, id, email, pwdHash, acceptsPrivacyPolicy, acceptsDataProtection })
            }))
            .then(r => r.json())
            .then(r => { if (r?.error) setError(r.error); else setSuccess(true); })
            .catch(e => { console.error("Ack! Bad register action! Got: ", e); setError("No se pudo completar el registro."); });
    };

    return <RegisterContext_Bare.Provider value={{
        name, setName, id, setId, email, setEmail, pwd, setPwd, confirmPwd, setConfirmPwd,
        acceptsPrivacyPolicy, setAcceptsPrivacyPolicy, acceptsDataProtection, setAcceptsDataProtection,
        error, success, register
    }}>{children}</RegisterContext_Bare.Provider>;
};

export const useRegister = () => {
    const ctx = useContext(RegisterContext_Bare);
    if (!ctx) throw new Error("can't get register context outside register context");
    return ctx;
};

export default RegisterContext;
