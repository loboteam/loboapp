"use client";
import { Button, Input } from "@/components/min/legacygeneric";
import { useLogin } from "@/stores/login";
import React from "react";

export const UserPwdBoxes: React.FC = () => {
    const { setId, setPwd, id, pwd } = useLogin();
    return <>
        <Input
            label="Número de matrícula"
            placeholder="2000345678"
            value={id}
            bindTo={setId}
        />
        <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={pwd}
            bindTo={setPwd}
        />
    </>
};

export const UserLoginButtons: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logIn, id, pwd, error, loading } = useLogin();
    
    const efun = (fun: (...args: any[]) => void, ...rest: any[]) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { 
        e?.preventDefault();
        try {
            await fun(...rest);
        } catch (err: any) {
            // Error is handled in context
        }
    }
    
    const isDisabled = !id || !pwd || loading;
    
    return <>
        {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                <p className="text-sm font-semibold text-red-700">Error de autenticación</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
        )}
        <Button onClick={efun(logIn)} disabled={isDisabled} className="w-full">
            {loading ? "Cargando..." : "Entrar como Estudiante"}
        </Button>
        {children}
        <Button variant="secondary" onClick={efun(() => logIn(true))} disabled={isDisabled} className="w-full">
            {loading ? "Cargando..." : "Entrar como Administrador"}
        </Button>
    </>
};

export const UserRemember: React.FC = ()=>{
    const { perma, setPerma } = useLogin();
    return <Input type="checkbox" className="hidden" value={perma} bindTo={setPerma} />;
}