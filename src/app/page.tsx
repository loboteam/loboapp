import { GlassCard } from "@/components/min/legacygeneric";
import { ICONS } from "@/lib/constants";
import { IfAdmin, IfLogged, IfNotAdmin, IfNotLogged } from '@/stores/user';
import { FirstName } from '@/components/min/usermins';
import ALink from '@/components/min/alink';
import Login from "@/components/layout/login";

const Dash = () => <div className="space-y-8 fade-in">
    <IfLogged>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h2 className="text-4xl font-extrabold tracking-tighter">
                    <IfAdmin>Módulo Central Admin
                        <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistema Operativo</span>
                        </div>
                    </IfAdmin>
                    <IfNotAdmin>Panel Universitario: <FirstName/></IfNotAdmin>
                </h2>
                <p className="text-slate-500 mt-1 font-medium">
                    <IfAdmin>Control total sobre el ecosistema de espacios.</IfAdmin>
                    <IfNotAdmin>Bienvenido al sistema de reservaciones.</IfNotAdmin>
                </p>
            </div>
        </header>
    </IfLogged>
    <IfNotLogged>
        <Login/>
    </IfNotLogged>
    {/* ENLACES ESTRATÉGICOS (Mapa del Sitio) */}

    <IfLogged>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ALink to="/reservar">
                <GlassCard hover className="h-full border-teal-500/20 bg-teal-500/5 group">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-16 h-16 rounded-4xl bg-teal-400/20 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {ICONS.Reservations}
                        </div>
                        <h3 className="text-xl font-bold mb-2">Haz una reservación</h3>
                        <p className="text-xs text-slate-500 px-4 leading-relaxed">Agenda un espacio disponible por hora de forma inmediata.</p>
                    </div>
                </GlassCard>
            </ALink>

            <ALink to="/mis-reservas">
                <GlassCard hover className="h-full border-blue-500/20 bg-blue-500/5 group">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-16 h-16 rounded-4xl bg-blue-400/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {ICONS.MyReservations}
                        </div>
                        <h3 className="text-xl font-bold mb-2">Mis reservas</h3>
                        <p className="text-xs text-slate-500 px-4 leading-relaxed">Consulta tus activos, historial y estadísticas personales.</p>
                    </div>
                </GlassCard>
            </ALink>
            <IfAdmin>
                <ALink to="/admin">
                    <GlassCard hover className="h-full border-purple-500/20 bg-purple-500/5 group">
                        <div className="flex flex-col items-center text-center py-6">
                            <div className="w-16 h-16 rounded-4xl bg-purple-400/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {ICONS.Stats}
                            </div>
                            <h3 className="text-xl font-bold mb-2">Estadísticas</h3>
                            <p className="text-xs text-slate-500 px-4 leading-relaxed">Analiza el rendimiento global y la ocupación del campus.</p>
                        </div>
                    </GlassCard>
                </ALink>
            </IfAdmin>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            <GlassCard className="border-l-4 border-teal-500">
                <h3 className="text-xl font-bold mb-4">Avisos del Sistema</h3>
                <ul className="space-y-3">
                    {[
                        'Actualización de políticas de reserva para el próximo ciclo.',
                        'Nuevo laboratorio de Robótica disponible en el Piso 4.',
                        'Mantenimiento programado de servidores este domingo.'
                    ].map((msg, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-400 items-start">
                            <div className="mt-1 text-teal-400">{ICONS.Check}</div>
                            <span>{msg}</span>
                        </li>
                    ))}
                </ul>
            </GlassCard>
            <GlassCard className="bg-linear-to-br from-white/3 to-transparent">
                <h3 className="text-xl font-bold mb-6">Estado Actual</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 glass-dark rounded-2xl">
                        <div className="text-2xl font-black">08</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Espacios Libres</div>
                    </div>
                    <IfLogged><div className="p-4 glass-dark rounded-2xl">
                        <div className="text-2xl font-black">12</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Tus Puntos</div>
                    </div></IfLogged>
                </div>
            </GlassCard>
        </div>
    </IfLogged>
</div>;

export default Dash;