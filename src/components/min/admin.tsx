"use client";
import { Button, Input } from "@/components/min/legacygeneric";
import { ICONS } from "@/lib/constants";
import { useEffect, useState } from "react";
import BoundModal from "@/components/min/boundmodal";
import { useUser } from "@/stores/user";
import { useSpace } from "@/stores/space";

interface NameValueOpt<T> {
    value: T,
    label: string
};
interface SpaceOptionsResponse {
    edif: NameValueOpt<string>[],
    tipo: NameValueOpt<number>[]
};

export const RegisterSpace: React.FC = () => {
    const [isCreating, showCreate] = useState<boolean>(false);
    const [err, setErr] = useState<string | null>(null);

    const [tipo, setTipo] = useState<number>(0);
    const [edif, setEdif] = useState<string>('');
    const [cupo, setCupo] = useState<number>(5);
    const [abre, setAbre] = useState<number>(6);
    const [cierra, setCierra] = useState<number>(22);
    const [of_edif, setOf_edif] = useState<number>(1);

    const { user } = useUser();
    const { spaces } = useSpace();

    const createSpace = () =>
        fetch("/space", {
            method: "POST", headers: { "Authorization": `Bearer ${user?.token}` }, body: JSON.stringify({
                tipo, edif, cupo, of_edif, abre, cierra
            })
        }).then(r => { showCreate(false);  return r.text()}).then(t=>{
            spaces?.push({
                type: typeOptions.find(e=>e.value === tipo)?.label!, location: edif, cupo, number: of_edif, abre, cierra, taken: [], down: false, sid: t, rating: null, max: 3600
                });

        })
        .catch(e=>e);

    const [edifOptions, setEdifOptions] = useState<NameValueOpt<string>[]>([]);
    const [typeOptions, setTypeOptions] = useState<NameValueOpt<number>[]>([]);
    const minOpens = Array.from({ length: 21 - 6 }).map((_e, i) => ({ value: 6 + i, label: `${6+i < 10 && 0 || ''}${6+i}:00`}));
    const maxCloses = Array.from({ length: 22 - 7 }).map((_e, i) => ({ value: 7 + i, label: `${7+i < 10 && 0 || ''}${7+i}:00`}));

    const populateOptions = () => {fetch("/spaceoptions", { headers: { "Authorization": `Bearer ${user?.token}` } }).then(e=>e.json() as Promise<SpaceOptionsResponse>).then(({edif, tipo})=>{
        setEdifOptions(edif); setTypeOptions(tipo);
        setEdif(edif[0].value); setTipo(tipo[0].value);
    }).catch(setErr)};
    useEffect(populateOptions, []);

    return <>
        <Button size="sm" icon={ICONS.Plus} onClick={()=>showCreate(true)}>Crear Nuevo Espacio</Button>
        <BoundModal to={isCreating} triggering={createSpace} cancel={()=>showCreate(false)}>
            <h3 className="text-xl font-black text-teal-400">Crear espacio</h3>
            <Input type="select" label="Edificio" options={edifOptions} bindTo={setEdif}/>
            <Input type="select" label="Tipo" options={typeOptions} bindTo={setTipo}/>
            <Input type="number" label="Número" value={of_edif} bindTo={setOf_edif}/>
            <Input type="select" label="Abre" options={minOpens} bindTo={setAbre}/>
            <Input type="select" label="Cierra" options={maxCloses} bindTo={setCierra}/>
            <Input type="number" label="Cupo" value={cupo} bindTo={setCupo}/>
            {err && (<div className="w-full bg-red-300 text-red-950 border-red-800 border-2 rounded-md px-2 py-1"><strong>Error!</strong> {err}</div>)}
        </BoundModal>
    </>
};