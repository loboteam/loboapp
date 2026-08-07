import type { Metadata } from "next";
import { MobileMenuButton } from "@/stores/layoutstate";
import "./globals.css";
import { APP_THEME } from "@/lib/constants";
import MobileMenuContext from "@/stores/layoutstate";
import MobileMenu from "@/components/layout/mobilemenu";
import Sidebar from "@/components/layout/sidebar";
import UserContext, { IfLogged } from "@/stores/user";
import { Breadcrumbs } from "@/components/min/alink";

export const metadata: Metadata = {
    title: "LoboApp - Sistema de Reservaciones",
    description: "Sistema de reservación de espacios universitarios: encuentra y reserva salas, laboratorios y espacios del campus.",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return <html lang="es"><body className="min-h-screen flex flex-col md:flex-row bg-gray-50"><MobileMenuContext>
        <UserContext>
            <IfLogged>
                <Sidebar/>
            </IfLogged>
            <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <span className="font-bold text-gray-900">LoboApp</span>
                </div>
                <MobileMenuButton classes={["p-2","text-gray-600"]}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </MobileMenuButton>
                <Breadcrumbs />
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-10 mx-auto w-full overflow-hidden">
                {children}
                <footer className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        © 2025 LoboApp - Sistema de Reservaciones
                    </p>
                </footer>
            </main>
        </UserContext>

        {/* Mobile Menu Overlay */}
        <MobileMenu/>
    </MobileMenuContext></body></html>;
};

export default Layout;