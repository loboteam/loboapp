import { GlassCard } from "@/components/min/legacygeneric";
import { ICONS } from "@/lib/constants";
import { KillSpace, OpenReservationButton, SpaceParams } from "@/stores/space";
import { IfAdmin } from "@/stores/user";
import { useEffect, useState } from "react";

const Space: React.FC<{ space: SpaceParams }> = ({ space }) => <GlassCard className="flex flex-col gap-6 overflow-hidden group hover:shadow-lg transition-shadow">
    {/* Header */}
    <div className="flex flex-col gap-3">
        <div>
            <h3 className="text-xl font-bold text-gray-900">{space.type} {space.number}</h3>
            <p className="text-sm text-gray-600">Edificio {space.location}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-400">
                {Array(5).fill(null).map((_h, i) => (
                    <span key={`star-${i}`}>
                        {i < (space.rating || 0) ? ICONS.StarFilled : ICONS.Star}
                    </span>
                ))}
            </div>
            <span className="text-xs text-gray-600">{space.rating ? `${space.rating}★` : "Sin reseñas"}</span>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
            {ICONS.Capacity}
            <span>Hasta {space.cupo} personas</span>
        </div>
    </div>

    <MutableSpacePart space={space}/>
</GlassCard>;

export const MutableSpacePart: React.FC<{ space: SpaceParams }> = ({ space }) => {
    "use client";
    const [down, setDown] = useState<boolean>(space.down);
    const isBusy = (time: number) => Array.isArray(space.taken) ? space.taken.map(e=>JSON.parse(e)).some(r=>time >= r.from && time < r.to) : false;

    return <>
        {/* Availability */}
        {!(down) && <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Disponibilidad por hora</p>
            <div className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: space.cierra! - space.abre! }).map((_h, i) => (
                    <div key={`hour-${space.sid}-${i}`} className="flex flex-col items-center gap-1">
                        <div className={`w-full h-10 rounded-md border transition-all duration-300 ${isBusy(space.abre! + i)
                            ? 'bg-red-100 border-red-300'
                            : 'bg-green-50 border-green-300 hover:bg-green-100 cursor-pointer'
                            }`}></div>
                        <span className="text-[10px] font-semibold text-gray-600">{space.abre! + i}h</span>
                    </div>
                ))}
            </div>
        </div>}

        {/* Action Button */}
        <div className="mt-2">
            <OpenReservationButton space={{...space, down}} />
            <IfAdmin><KillSpace sid={space.sid} down={down} bindTo={setDown} /></IfAdmin>
        </div>
    </>
};

export default Space;