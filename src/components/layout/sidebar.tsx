import { ICONS } from "@/lib/constants";
import ALink from "@/components/min/alink";
import { LogoutButton } from "@/stores/user";
import UserGloss from "@/components/med/usergloss";

const Sidebar: React.FC = () => <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 shadow-sm">
    {/* Logo */}
    <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center shadow-md">
                <span className="font-bold text-lg text-white">L</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">LoboApp</h1>
        </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 p-4 space-y-1">
        <ALink to="/" icon={ICONS.Dashboard} classes={["flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "text-gray-700", "hover:bg-green-50", "hover:text-green-600", "transition-all", "duration-200"]}>
            Dashboard
        </ALink>
        <ALink to="/reservar" icon={ICONS.Reservations} classes={["flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "text-gray-700", "hover:bg-green-50", "hover:text-green-600", "transition-all", "duration-200"]}>
            Reservar
        </ALink>
        <ALink to="/my" icon={ICONS.MyReservations} classes={["flex", "items-center", "gap-3", "px-4", "py-3", "rounded-lg", "text-gray-700", "hover:bg-green-50", "hover:text-green-600", "transition-all", "duration-200"]}>
            Mis Reservas
        </ALink>
    </nav>

    {/* User Section */}
    <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="px-4 py-3 bg-gray-50 rounded-lg">
            <UserGloss />
        </div>
        <LogoutButton
            classes={["flex", "items-center", "gap-3", "px-4", "py-3", "w-full", "rounded-lg", "text-gray-700", "hover:bg-red-50", "hover:text-red-600", "transition-all", "duration-200", "font-medium"]}
        >
            {ICONS.Logout}
            <span>Salir</span>
        </LogoutButton>
    </div>
</aside>;

export default Sidebar;