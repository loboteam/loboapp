import { MobileMenuButton } from "@/stores/layoutstate";
import "./globals.css";
import { APP_THEME } from "@/lib/constants";
import MobileMenuContext from "@/stores/layoutstate";
import MobileMenu from "@/components/layout/mobilemenu";
import Sidebar from "@/components/layout/sidebar";
import UserContext, { IfLogged } from "@/stores/user";
import { Breadcrumbs } from "@/components/min/alink";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return <html><body className="min-h-screen flex flex-col md:flex-row"><MobileMenuContext>
        <UserContext>
            <IfLogged>
                <Sidebar/>
            </IfLogged>
            <header className="md:hidden glass p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${APP_THEME.gradientPrimary} flex items-center justify-center`}>
                    <span className="text-white font-bold">L</span>
                </div>
                <span className="font-bold">LoboApp</span>
                </div>
                <MobileMenuButton classes={["p-2","text-slate-400"]}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </MobileMenuButton>
                <Breadcrumbs />
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-10 mx-auto w-full overflow-hidden">
                {children}
                <footer>
                    <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.3em]">
                        DS02SV-25 &copy; 2025
                    </p>
                </footer>
            </main>
        </UserContext>

        {/* Mobile Menu Overlay */}
        <MobileMenu/>
    </MobileMenuContext></body></html>;
};

export default Layout;