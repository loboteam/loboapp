"use client";

import { Button } from "@/components/min/legacygeneric";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface MobileMenuState_Container {
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
    return <button onClick={() => toggleMenu()} className={classes?.join(" ")}>
        {children}
    </button>;
};

export default MobileMenuContext;

export interface QRData {
    user?: number
    sala: string,
    day: Date,
    from: number
};

type AvailableTabs = 'activas' | 'completadas' | 'canceladas';
interface TabContainer {
    currentTab: AvailableTabs | null,
    selectTab: Dispatch<SetStateAction<AvailableTabs | null>>
};

export const TabContext_Bare = createContext<TabContainer | null>(null);
export const TabContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTab, selectTab] = useState<AvailableTabs | null>('activas');

    return <TabContext_Bare.Provider value={{ currentTab, selectTab }}>{children}</TabContext_Bare.Provider>
};

export const useTabs = () => {
    const ctx = useContext(TabContext_Bare);
    if (!ctx) throw new Error("useTabs must be used within TabContext or equiv!");
    return ctx;
};

export const TabSelector: React.FC<{tab: AvailableTabs}> = ({tab}) => {
    const { currentTab, selectTab } = useTabs();
    return <Button
    variant={currentTab === tab ? 'primary' : 'secondary'}
    onClick={() => { selectTab(tab); }}
    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
    >
        {tab}
    </Button>
};