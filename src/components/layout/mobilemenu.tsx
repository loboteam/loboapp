"use client";

import { ICONS } from "@/lib/constants";
import ALink from "@/components/min/alink";
import { mobileMenuCtx } from "@/stores/layoutstate";
import { IfAdmin, LogoutButton } from "@/stores/user";

export const MobileMenu = () => {
    const { isMenuOpen, toggleMenu } = mobileMenuCtx();
    return isMenuOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm md:hidden" onClick={toggleMenu}>
            <div className="absolute right-0 top-0 h-full w-64 glass p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <ALink to="/dashboard" icon={ICONS.Dashboard}>Dashboard</ALink>
                <ALink to="/reservar" icon={ICONS.Reservations}>Reservar</ALink>
                <ALink to="/my" icon={ICONS.MyReservations}>Mis Reservas</ALink>
                <IfAdmin>
                    <ALink to="/admin" icon={ICONS.Admin}>Admin</ALink>
                </IfAdmin>
                <LogoutButton classes={["flex", "items-center", "gap-3", "px-4", "py-3", "w-full", "rounded-xl", "text-red-400", "mt-8"]}>
                    {ICONS.Logout} Salir
                </LogoutButton>
            </div>
        </div>
    );
};

export default MobileMenu;