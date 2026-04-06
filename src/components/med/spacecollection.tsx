"use client";
import { ENDPOINTS } from "@/lib/constants";
import { SpaceParams, useSpace } from "@/stores/space";
import React, { useEffect, useRef, useState } from "react";
import Space from "@/components/min/space";
import { Button, AnimatedCard } from "../min/legacygeneric";

const PAGINATION_SIZE = 5;

const SpaceCollection: React.FC = () => {
    const { spaces, setSpaces, type, cupo, edif, time } = useSpace();
    const [page, setPage] = useState(1);
    const [loadable, setLoadable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skipInitialRef = useRef(true);

    const buildUrl = (pageNum: number, t: string, c: any, e: string | null) => {
        const params = new URLSearchParams();
        if (pageNum > 0) params.set("page", `${pageNum}`);
        if (t) params.set("type", t);
        if (c) params.set("cupo", `${c}`);
        if (e) params.set("edif", e);
        const qs = params.toString();
        return `${ENDPOINTS.getSpaces}${qs ? "?" + qs : ""}`;
    };

    const search = (t: string, c: any, e: string | null) => {
        setLoading(true);
        setPage(1);
        fetch(buildUrl(0, t, c, e))
            .then(r => r.json())
            .then((sps: SpaceParams[] | null) => {
                setLoadable(Array.isArray(sps) && sps.length >= PAGINATION_SIZE);
                setSpaces(Array.isArray(sps) ? sps : []);
                setLoading(false);
            })
            .catch(() => { setSpaces([]); setLoading(false); });
    };

    // Initial load
    useEffect(() => {
        search(type, cupo, edif);
    }, []);

    // Type filter — debounced (text input)
    useEffect(() => {
        if (skipInitialRef.current) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(type, cupo, edif), 500);
    }, [type]);

    // Select filters — immediate, skip on first mount
    useEffect(() => {
        if (skipInitialRef.current) { skipInitialRef.current = false; return; }
        search(type, cupo, edif);
    }, [cupo, edif]);

    const loadMore = () => {
        setLoadingMore(true);
        fetch(buildUrl(page, type, cupo, edif))
            .then(r => r.json())
            .then((sps: SpaceParams[] | null) => {
                if (Array.isArray(sps) && sps.length > 0) {
                    setLoadable(sps.length >= PAGINATION_SIZE);
                    setSpaces(prev => [...(prev ?? []), ...sps]);
                    setPage(prev => prev + 1);
                } else {
                    setLoadable(false);
                }
                setLoadingMore(false);
            })
            .catch(() => setLoadingMore(false));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full spinner mb-4"></div>
                <p className="text-gray-600 font-semibold">Cargando resultados...</p>
            </div>
        );
    }

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

    // Client-side duration filter: show spaces open for at least `time` hours
    const minHours = time ? parseInt(time) : 0;
    const filtered = minHours > 0
        ? spaces.filter(s => (s.cierra - s.abre) >= minHours)
        : spaces;

    if (filtered.length === 0) {
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

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((space, i) => (
                    <AnimatedCard key={space.sid || i} delay={i * 80}>
                        <Space space={space} />
                    </AnimatedCard>
                ))}
            </div>
            {loadable && (
                <div className="flex justify-center pt-6">
                    <Button onClick={loadMore} disabled={loadingMore}>
                        {loadingMore ? "Cargando..." : "Cargar más resultados"}
                    </Button>
                </div>
            )}
        </>
    );
};

export default SpaceCollection;
