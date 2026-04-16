"use client";

import { Button } from "@/components/min/legacygeneric";
import { ICONS } from "@/lib/constants";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { useUser } from "@/stores/user";

interface QRData {
    user?: number
    sala: string,
    day: Date,
    from: number
};

interface QRContainer {
    showingQR: boolean,
    setShowingQR: Dispatch<SetStateAction<boolean>>,
    currentQR: QRData | null,
    setQR: Dispatch<SetStateAction<QRData | null>>,
    showQR: (qr: QRData)=>void
};

export const QRContext_Bare = createContext<QRContainer | null>(null);
export const QRCContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showingQR, setShowingQR] = useState<boolean>(false);
    const [currentQR, setQR] = useState<QRData | null>(null);
    const showQR = (qr: QRData) => {
        setQR(qr);
        if (!showingQR) setShowingQR(true);
    };

    return <QRContext_Bare.Provider value={{ showingQR, setShowingQR, currentQR, setQR, showQR }}>{children}</QRContext_Bare.Provider>
};

export const useQR = () => {
    const ctx = useContext(QRContext_Bare);
    if (!ctx) throw new Error("useQR must be used within QRContext or equiv!");
    return ctx;
};

export const QRButton: React.FC<{ data: QRData }> = ({ data }) => {
    const { showQR } = useQR();
    const { user } = useUser();
    return <Button size="sm" icon={ICONS.Check} onClick={()=>showQR({...data, user: user?.id})}>Mostrar código QR</Button>;
};