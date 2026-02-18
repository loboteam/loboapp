import { ICONS, APP_THEME } from "@/lib/constants";
import ALink from "@/components/min/alink";
import { LogoutButton } from "@/stores/user";
import UserGloss from "@/components/med/usergloss";

const Sidebar: React.FC = () => <aside className="hidden md:flex flex-col w-72 p-6 glass-dark border-r border-white/5 h-screen sticky top-0">
    <div className="mb-10 flex items-center gap-3 px-2">
        <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${APP_THEME.gradientPrimary} flex items-center justify-center shadow-lg`}>
            <span className="font-black text-xl">L</span>
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">LoboApp</h1>
        </div>
    </div>

    <nav className="flex-1 space-y-2">
        <ALink to="/dashboard" icon={ICONS.Dashboard}>Dashboard</ALink>
        <ALink to="/reservas" icon={ICONS.Reservations}>Reservar</ALink>
        <ALink to="/disponibilidad" icon={ICONS.Stats}>Disponibilidad</ALink>
        <ALink to="/mis-reservas" icon={ICONS.MyReservations}>Mis Reservas</ALink>
    </nav>

    <div className="mt-auto pt-6 border-t border-white/5">
        <div className="px-4 mb-4 flex items-center gap-3">
            <UserGloss />
        </div>
        <LogoutButton
            classes={["flex", "items-center", "gap-3", "px-4", "py-3", "w-full", "rounded-xl", "text-slate-400", "hover:text-red-400", "hover:bg-red-400/10", "transition-all", "duration-300"]}
        >
            {ICONS.Logout}
            <span className="font-medium">Salir del Sistema</span>
        </LogoutButton>
    </div>
</aside>;

export default Sidebar;