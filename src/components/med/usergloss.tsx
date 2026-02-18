"use client";
import { useUser } from "@/stores/user";

export const UserGloss: React.FC = () => {
    const { user } = useUser();
    return user ? <>
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold">
            {user.name.charAt(0)}
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold truncate">{user.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{user.admin ? 'Staff Universitario' : 'Estudiante Activo'}</div>
        </div>
    </> : "Not logged in.";
};

export default UserGloss;