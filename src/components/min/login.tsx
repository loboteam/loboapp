"use client";
import { Button, Input } from "@/components/min/legacygeneric";
import { useLogin } from "@/stores/login";
import React, { useState } from "react";

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
    const [logging, setLogging] = useState<0 | 1 | 2>(0);
    const { logIn } = useLogin();
    const efun = (fun: (...args: any[]) => void, ...rest: any[]) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { e?.preventDefault(); fun(...rest); }
    return <>
        <Button onClick={efun(() => { setLogging(1); logIn().finally(()=>setLogging(0));})} disabled={logging > 0} loading={logging===1}>
            Entrar como Estudiante
        </Button>
        {children}
        <Button variant="secondary" onClick={efun(() => { setLogging(2); logIn(true).finally(()=>setLogging(0)); })} disabled={logging > 0} loading={logging===2}>
            Entrar como Administrador
        </Button>
    </>
};

export const UserRemember: React.FC = ()=>{
    const { perma, setPerma } = useLogin();
    return <Input type="checkbox" className="" value={perma} bindTo={setPerma} />;
}