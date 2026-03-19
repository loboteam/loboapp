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
    const [loading, setLoading] = useState(false);
    
    useEffect(() => { 
        setLoading(true);
        fetch(ENDPOINTS.getSpaces)
            .then(r => r.json())
            .then((sps: SpaceParams[] | null)=>{
                if (sps && sps.length > 4) setLoadable(true);
                setSpaces(sps);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);
    
    const wipeThenSearch = () => {
        setLoading(true);
        setSpaces(null);
        const url = new URL(window.location.protocol + "//" + window.location.host);
        url.pathname = ENDPOINTS.getSpaces;
        if (page > 1) url.searchParams.append("page", `${page}`);
        if (type) url.searchParams.append("type", type);
        if (cupo) url.searchParams.append("cupo", cupo);
        fetch(url.toString())
            .then(r => r.json())
            .then((sps: SpaceParams[] | null) => {
                if (sps && sps.length > 4) setLoadable(true);
                else setLoadable(false);
                setSpaces(sps);
                setLoading(false);
            })
            .catch(() => {
                setSpaces([]);
                setLoading(false);
            });
    };
    
    useEffect(()=>{
        if(timeout) window.clearTimeout(timeout);
        setTimeoutNum(window.setTimeout(wipeThenSearch, 500));
    }, [type]);
    
    useEffect(()=>{
        if(timeout) window.clearTimeout(timeout);
        wipeThenSearch();
    }, [cupo]);
    
    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full spinner mb-4"></div>
                <p className="text-gray-600 font-semibold">Cargando resultados...</p>
            </div>
        );
    }
    
    // No results state
    if (spaces && spaces.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.305 3.305a7.5 7.5 0 0010.345 10.345z" />
                </svg>
                <p className="text-gray-600 font-semibold mb-2">No se encontraron resultados</p>
                <p className="text-gray-500 text-sm">Intenta ajustar tus filtros de búsqueda</p>
            </div>
        );
    }
    
    if (!spaces) return null;
    
    const renderGalaxy = ()=>spaces.map((space, i) => <Space space={space} key={i} />);
    
    const loadMore = () => {
        setPage(prev=>prev + 1);
        setLoading(true);
        fetch(`${ENDPOINTS.getSpaces}/?page=${page}${type ? "&type=" + type : ""}${cupo ? "&cupo=" + cupo : ""}`)
            .then(r => r.json())
            .then((s: SpaceParams[] | null) =>{
                if (!s || s.length < 4) return setLoadable(false);
                setSpaces(() => spaces.concat(s));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderGalaxy()}
            </div>
            {loadable && (
                <div className="flex justify-center pt-6">
                    <Button onClick={loadMore} disabled={loading}>
                        {loading ? "Cargando..." : "Cargar más resultados"}
                    </Button>
                </div>
            )}
        </>
    );
};

export default SpaceCollection;