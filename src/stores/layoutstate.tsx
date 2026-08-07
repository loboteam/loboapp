"use client";

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type MobileMenuState_Container = {
    isMenuOpen: boolean,
    setMenuOpen: Dispatch<SetStateAction<boolean>>,
    toggleMenu: ()=>void
};

export const MobileMenuContext_Bare = createContext<MobileMenuState_Container | null>(null);

const MobileMenuContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    return <MobileMenuContext_Bare.Provider value={{isMenuOpen, setMenuOpen, toggleMenu}}>{children}</MobileMenuContext_Bare.Provider>
};

export const mobileMenuCtx = ()=> {
    const context = useContext(MobileMenuContext_Bare);
    if (!context) throw new Error("mobileMenuCtx must be used within MobileMenuContext or equivalent!");
    return context;
};

export const MobileMenuButton: React.FC<{ children?: React.ReactNode, classes?: string[] }> = ({ children, classes }) => {
    const { toggleMenu } = mobileMenuCtx();
    return <button onClick={() => toggleMenu()} aria-label="Abrir menú" className={classes?.join(" ")}>
        {children}
    </button>;
};

export default MobileMenuContext;