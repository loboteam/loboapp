"use client";
import { Button, Input, Modal } from "@/components/min/legacygeneric";
import { useRegister } from "@/stores/register";
import { PRIVACY_POLICY, DATA_PROTECTION_NOTICE } from "@/components/min/legalcontent";
import React, { useState } from "react";

export const RegisterFields: React.FC = () => {
    const { name, setName, id, setId, email, setEmail, pwd, setPwd, confirmPwd, setConfirmPwd } = useRegister();
    return <>
        <Input label="Nombre completo" placeholder="Ana Torres" value={name} bindTo={setName} />
        <Input label="Número de matrícula" placeholder="2000345678" value={id} bindTo={setId} />
        <Input label="Correo institucional" type="email" placeholder="ana.torres@uni.edu" value={email} bindTo={setEmail} />
        <Input label="Contraseña" type="password" placeholder="••••••••" value={pwd} bindTo={setPwd} />
        <Input label="Confirmar contraseña" type="password" placeholder="••••••••" value={confirmPwd} bindTo={setConfirmPwd} />
    </>;
};

const ConsentCheckbox: React.FC<{ checked: boolean, onChange: (v: boolean) => void, onView: () => void, article: string, documentName: string }> = ({ checked, onChange, onView, article, documentName }) =>
    <label className="flex items-start gap-2">
        <input
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <span className="text-xs text-gray-700">
            He leído y acepto {article}{" "}
            <button
                type="button"
                onClick={onView}
                className="font-semibold text-green-600 hover:text-green-700 underline underline-offset-2"
            >
                {documentName}
            </button>
        </span>
    </label>;

export const RegisterConsent: React.FC = () => {
    const { acceptsPrivacyPolicy, setAcceptsPrivacyPolicy, acceptsDataProtection, setAcceptsDataProtection } = useRegister();
    const [openDoc, setOpenDoc] = useState<"privacy" | "data" | null>(null);
    return <>
        <ConsentCheckbox
            checked={acceptsPrivacyPolicy}
            onChange={setAcceptsPrivacyPolicy}
            onView={() => setOpenDoc("privacy")}
            article="el"
            documentName="Aviso de Privacidad"
        />
        <ConsentCheckbox
            checked={acceptsDataProtection}
            onChange={setAcceptsDataProtection}
            onView={() => setOpenDoc("data")}
            article="la"
            documentName="Política de Protección de Datos Personales"
        />
        <Modal isOpen={openDoc === "privacy"} onClose={() => setOpenDoc(null)} title="Aviso de Privacidad">
            {PRIVACY_POLICY}
        </Modal>
        <Modal isOpen={openDoc === "data"} onClose={() => setOpenDoc(null)} title="Política de Protección de Datos Personales">
            {DATA_PROTECTION_NOTICE}
        </Modal>
    </>;
};

export const RegisterError: React.FC = () => {
    const { error } = useRegister();
    if (!error) return null;
    return <p className="text-xs font-semibold text-red-600">{error}</p>;
};

export const RegisterSuccess: React.FC = () => {
    const { success } = useRegister();
    if (!success) return null;
    return <p className="text-xs font-semibold text-green-600">¡Cuenta creada correctamente!</p>;
};

export const RegisterButton: React.FC = () => {
    const { register, acceptsPrivacyPolicy, acceptsDataProtection } = useRegister();
    const efun = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { e.preventDefault(); register(); };
    return <Button onClick={efun} disabled={!acceptsPrivacyPolicy || !acceptsDataProtection} className="w-full">
        Crear cuenta
    </Button>;
};
