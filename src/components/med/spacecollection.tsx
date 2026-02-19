"use client";
import { ENDPOINTS } from "@/lib/constants";
import { SpaceParams, useSpace } from "@/stores/space";
import React, { useEffect, useState } from "react";
import Space from "@/components/min/space";
import { Button } from "../min/legacygeneric";

const SpaceCollection: React.FC = () => {
    const { spaces, setSpaces, type, cupo } = useSpace();
    const [page, setPage] = useState(1);
    const [loadable, setLoadable] = useState(true);
    const [timeout, setTimeoutNum] = useState<number | null>(null);
    const [loading, setLoading] = useState<number>(1);
    const wipeThenSearch = () => {
        const url = new URL(window.location.protocol + "//" + window.location.host);
        url.pathname = ENDPOINTS.getSpaces;
        if (page > 1) url.searchParams.append("page", `${page}`);
        if (type) url.searchParams.append("type", type);
        if (cupo) url.searchParams.append("cupo", cupo);
        setLoading(1);
        fetch(url.toString()).then(r => r.json()).then((sps: SpaceParams[] | null) => {
            if (sps && sps.length > 4) setLoadable(false);
            setSpaces(sps);
            setLoading(0);
        }).catch(e=>{
            setLoading(-1);
            console.error(e);
        });
    };
    useEffect(()=>{
        if(timeout) window.clearTimeout(timeout);
        setPage(1);
        setTimeoutNum(window.setTimeout(()=>wipeThenSearch(), 500));
    }, [type, cupo]);
    if (loading === 1) return <h4 className="italic text-slate-500 w-full text-center">Cargando...</h4>;
    if (loading < 0 || loading > 1) return <h4 className="text-red-700">you've met a terrible fate, haven't you?</h4>;
    if (!spaces) return <h4 className="italic text-slate-900 w-full text-center">Sin resultados!</h4>;
    const renderGalaxy = ()=>spaces.map((space, i) => <Space space={space} key={i} />);
    const loadMore = React.cache(() => {
        setPage(prev=>prev + 1);
        setLoading(1);
        fetch(`${ENDPOINTS.getSpaces}/?page=${page}${type ? "&type=" + type : ""}${cupo ? "&cupo=" + cupo : ""}`).then(r => r.json()).then((s: SpaceParams[] | null) =>{
            if (!s || s.length < 4) return setLoadable(false);
            setSpaces(() => spaces.concat(s));
            setLoading(0);
        }).catch(e=>{
            setLoading(-1);
            console.error(e);
        });
    });
    return loadable ? renderGalaxy().concat(<Button onClick={loadMore} key={999999}>Cargar más...</Button>) : renderGalaxy();
};

export default SpaceCollection;