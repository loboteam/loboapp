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
        setPage(1);
        setSpaces(null);
        const url = new URL(window.location.protocol + "//" + window.location.host);
        url.pathname = ENDPOINTS.getSpaces;
        if (page > 1) url.searchParams.append("page", `${page}`);
        if (type) url.searchParams.append("type", type);
        if (cupo) url.searchParams.append("cupo", cupo);
        setLoading(1);
        fetch(url.toString())
            .then(r => r.json())
            .then((sps: SpaceParams[] | null) => {
                if (sps && sps.length > 4) setLoadable(true);
                else setLoadable(false);
                setSpaces(sps);
                setLoading(0);
            })
            .catch(() => {
                setSpaces([]);
                setLoading(-1);
            });
    };

    useEffect(()=>{
        if(timeout) window.clearTimeout(timeout);
        setTimeoutNum(window.setTimeout(wipeThenSearch, 500));
    }, [type, cupo]);
    if (loading < 0 || loading > 1) return <h4 className="text-red-700">you've met a terrible fate, haven't you?</h4>;
    if (!spaces && loading === 1) return <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full spinner mb-4"></div>
        <p className="text-gray-600 font-semibold">Cargando resultados...</p>
    </div>;
    if (!spaces) return (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.305 3.305a7.5 7.5 0 0010.345 10.345z" />
            </svg>
            <p className="text-gray-600 font-semibold mb-2">Sin resultados!</p>
            <p className="text-gray-500 text-sm">Intenta ajustar tus filtros de búsqueda...</p>
        </div>
    );

    const renderGalaxy = ()=>spaces.map((space, i) => <Space space={space} key={i} />);

    const loadMore = React.cache(() => {
        setPage(prev=>prev + 1);
        setLoading(1);
        fetch(`${ENDPOINTS.getSpaces}/?page=${page}${type ? "&type=" + type : ""}${cupo ? "&cupo=" + cupo : ""}`)
            .then(r => r.json())
            .then((s: SpaceParams[] | null) => {
                if (!s || s.length < 4) setLoadable(false);
                if (!s) return;
                setSpaces(() => spaces.concat(s));
                setLoading(0);
            })
            .catch(e => { console.error(e); setLoading(-1) });
    });

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderGalaxy()}
            </div>
            {loadable ? (
                <div className="flex justify-center pt-6">
                    <Button onClick={loadMore} disabled={loading === 1} className="disabled:opacity-80">
                        {loading === 1 ? <div className="flex flex-col items-center justify-center py-4">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full spinner"></div>
                            <p className="text-white font-semibold">Cargando resultados...</p>
                        </div> : "Cargar más resultados"}
                    </Button>
                </div>
            ) : <p className="w-full text-center text-gray-500"><em>No hay más resultados.</em></p>}
        </>
    );
};

export default SpaceCollection;