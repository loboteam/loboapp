import { Badge, GlassCard } from "@/components/min/legacygeneric";
import { ICONS } from "@/lib/constants";
import { OpenReservationButton, SpaceParams } from "@/stores/space";

export const Space: React.FC<{ space: SpaceParams }> = ({space}) => {
    const isBusy = (time: number)=>space.taken.some(r=>time > r.from && time < r.to);
    return <GlassCard className="flex flex-col gap-8 shadow-2xl shadow-slate-300 overflow-hidden group">
        <div className="flex flex-col">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">{space.type} {space.number}, edif. {space.location}</h3>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    {Array(5).fill(ICONS.Star).map((_h,i)=>i < (space.rating || 0) ? ICONS.StarFilled : ICONS.Star)} {space.rating ?? "Sin reseñas todavía."}
                </div>
                <div className="mt-4 flex flex-col gap-2 text-slate-400 text-sm font-medium">
                    <div className="flex items-center gap-2">{ICONS.Capacity} Hasta {space.cupo} personas</div>
                </div>
            </div>
            <OpenReservationButton space={space} status={space.status} />
        </div>

        <div className="flex-1">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-4">Disponibilidad</span>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {space.status && Array(space.cierra! - space.abre!).map((_h, i) => <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-full h-16 rounded-xl border border-white/5 transition-all duration-300 ${isBusy(space.abre! + i) ? 'bg-slate-800' : 'bg-teal-500/10 hover:bg-teal-500/30 cursor-pointer border-teal-500/20'}`}></div>
                    <span className="text-[10px] font-bold text-slate-600">{space.abre! + i}:00</span>
                </div>)}
            </div>
        </div>
    </GlassCard>
};

export default Space;