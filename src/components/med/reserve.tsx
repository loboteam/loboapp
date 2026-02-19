"use client";
import BoundModal from "@/components/min/boundmodal";
import { useSpace } from "@/stores/space";
import { Input } from "@/components/min/legacygeneric";
import { useState } from "react";

const Reserve: React.FC = () => {
    const { currentSpace, selecting, toggleSelecting, time, setTime } = useSpace();

    if (selecting && !currentSpace) throw new Error("can't select an error that doesn't exist!");
    const isBusy = (time: number)=>currentSpace?.taken.some(r=>time > r.from && time < r.to);
    const timeOptions = currentSpace ?
        Array(currentSpace?.cierra! - currentSpace?.abre!)
        .map((_h,i)=>({value: currentSpace?.abre! + i, label: `${currentSpace?.abre! + i}:00`}))
        .filter((h,i)=>!isBusy(h.value))
    : [];

    return <BoundModal to={selecting} triggering={()=>toggleSelecting(false)} cancel={()=>toggleSelecting(false)}>
        <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Confirmar reservación?</span>
        <h4 className="text-xl text-slate-700 mt-1"><span className="font-bold">{currentSpace?.type} { currentSpace?.number }</span></h4>
        <p className="font-semibold text-slate-500">Edificio {currentSpace?.location}</p>
        <div className="grid grid-cols-2 gap-4">
            <Input label="Hora" type="select" value={time} options={timeOptions} bindTo={setTime} />
        </div>
    </BoundModal>;
};

export default Reserve;