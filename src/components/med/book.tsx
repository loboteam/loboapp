"use client";
import BoundModal from "@/components/min/boundmodal";
import { useSpace } from "@/stores/space";
import { Input } from "@/components/min/legacygeneric";
import { useUser } from "@/stores/user";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Book: React.FC = () => {
    const { currentSpace, selecting, toggleSelecting, time, setTime } = useSpace();
    const { user } = useUser();
    const router = useRouter();
    const [bookErr, changeBookErr] = useState<string | null>(null);

    if (selecting && !currentSpace) throw new Error("can't select an error that doesn't exist!");
    const isBusy = (time: number)=>currentSpace?.taken.map(e=>JSON.parse(e)).some(r=>time >= r.from && time < r.to);
    const timeOptions = currentSpace ?
        Array.from({length: currentSpace?.cierra! - currentSpace?.abre!})
        .map((_h,i)=>({value: currentSpace?.abre! + i, label: `${currentSpace?.abre! + i}:00`}))
        .filter((h,i)=>!isBusy(h.value))
    : [];

    const D = new Date();
    const tryBook = () => fetch("/book", { method: "POST", headers: { "Authorization": "Bearer " + user?.token }, body: JSON.stringify({
        from: parseInt(time),
        day: `${D.getFullYear()}-${D.getMonth() < 9 && "0" || ""}${D.getMonth() + 1}-${D.getDate() < 9 && "0" || ""}${D.getDate()}`,
        sala: currentSpace?.sid,
        to: parseInt(time) + ((currentSpace?.max ?? 3600) / 3600)
    }) }).then(d=>{
        if (!d.ok) throw d.text() ?? d.status;
        toggleSelecting(false);
        router.refresh();
    }).catch(changeBookErr);

    return <BoundModal to={selecting} triggering={tryBook} cancel={()=>toggleSelecting(false)}>
        <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Confirmar reservación?</span>
        <h4 className="text-xl text-slate-700 mt-1"><span className="font-bold">{currentSpace?.type} { currentSpace?.number }</span></h4>
        <p className="font-semibold text-slate-500">Edificio {currentSpace?.location}</p>
        <div className="grid grid-cols-2 gap-4">
            <Input label="Hora" type="select" value={time} options={timeOptions} bindTo={setTime} />
        </div>
        {bookErr && (<div className="w-full bg-red-300 text-red-950 border-red-800 border-2 rounded-md px-2 py-1"><strong>Error!</strong> {bookErr}</div>)}
    </BoundModal>;
};

export default Book;