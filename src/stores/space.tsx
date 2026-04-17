"use client";
import { Button } from "@/components/min/legacygeneric";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { useUser } from "@/stores/user";

export interface SpaceParams {
    taken: string[],
    abre: number,
    cierra: number,
    location: string, // edif
    down: boolean, // down
    sid: string,
    type: string, // tipos(nombre)
    rating: number | null, // reviews(avg(rating))
    cupo: number,
    max: number,
    number: number // of_edif
};

interface SpaceContainer {
    currentSpace: SpaceParams | null,
    selectSpace: Dispatch<SetStateAction<SpaceParams | null>>,
    spaces: SpaceParams[] | null,
    setSpaces: Dispatch<SetStateAction<SpaceParams[] | null>>,
    selecting: boolean,
    toggleSelecting: Dispatch<SetStateAction<boolean>>,
    type: string,
    setType: Dispatch<SetStateAction<string>>,
    time: any | null,
    setTime: Dispatch<SetStateAction<any | null>>,
    cupo: any | null,
    setCupo: Dispatch<SetStateAction<any | null>>,
    rating: number | null,
    setRating: Dispatch<SetStateAction<number | null>>,
    edif: string | null,
    setEdif: Dispatch<SetStateAction<string | null>>,
    hora: number | null,
    setHora: Dispatch<SetStateAction<number | null>>,
    lon: number,
    setLon: Dispatch<SetStateAction<number>>,
    aiExplanation: string | null,
    setAiExplanation: Dispatch<SetStateAction<string | null>>
};

export const SpaceContext_Bare = createContext<SpaceContainer | null>(null);
const SpaceContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSpace, selectSpace] = useState<SpaceParams | null>(null);
    const [selecting, toggleSelecting] = useState<boolean>(false);
    const [spaces, setSpaces] = useState<SpaceParams[] | null>(null);

    const [type, setType] = useState<string>("");
    const [time, setTime] = useState<any | null>(null);
    const [cupo, setCupo] = useState<any | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [edif, setEdif] = useState<string | null>(null);
    const [hora, setHora] = useState<number | null>(null);
    const [lon, setLon] = useState<number>(1);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);

    return <SpaceContext_Bare.Provider value={{ currentSpace, selectSpace, selecting, toggleSelecting, spaces, setSpaces, type, setType, time, setTime, cupo, setCupo, rating, setRating, edif, setEdif, hora, setHora, lon, setLon, aiExplanation, setAiExplanation }}>{children}</SpaceContext_Bare.Provider>
};

export const useSpace = () => {
    const ctx = useContext(SpaceContext_Bare);
    if (!ctx) throw new Error("useSpace must be used within SpaceContext or equiv!");
    return ctx;
};

export const OpenReservationButton: React.FC<{space: SpaceParams}> = ({space}) => {
    const { toggleSelecting, selectSpace } = useSpace();
    return <Button
    variant={!(space.down) ? 'primary' : 'secondary'}
    className="mt-6 w-full"
    disabled={space.down}
    onClick={() => { selectSpace(space); toggleSelecting(true); }}
    >
        {space.down ? 'En Mantenimiento' : 'Reservar'}
    </Button>
};

export const KillSpace: React.FC<{sid: string, down: boolean, bindTo: Dispatch<SetStateAction<boolean>>}> = ({sid, down, bindTo}) => {
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    return <Button
    variant="danger"
    className="mt-6 w-full"
    onClick={() => {
        setLoading(true);
        fetch(`/managespace?sala=${sid}`, {method: down ? "PUT" : "DELETE", headers: {"Authorization": `Bearer ${user?.token}`}})
            .then(r=>{
                if (!(r.ok)) throw r.text() ?? r.status;
                bindTo(()=>!down);
            })
            .catch(console.error)
            .finally(()=>setLoading(false))
    }}
    loading={loading}
    >
        {down ? "Activar" : "Desactivar"}
    </Button>
};

export default SpaceContext;