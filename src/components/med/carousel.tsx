"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ENDPOINTS, ICONS } from "@/lib/constants";
import { SpaceParams } from "@/stores/space";
import { Badge } from "@/components/min/legacygeneric";

const AUTOPLAY_MS = 4000;

const FeaturedCarousel: React.FC = () => {
    const [spaces, setSpaces] = useState<SpaceParams[]>([]);
    const [current, setCurrent] = useState(0);
    const [dir, setDir] = useState<"next" | "prev">("next");
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        fetch(ENDPOINTS.getSpaces)
            .then(r => r.json())
            .then((sps: SpaceParams[] | null) => {
                if (sps && sps.length > 0) setSpaces(sps.slice(0, 5));
            })
            .catch(() => {});
    }, []);

    const go = useCallback((direction: "next" | "prev") => {
        setDir(direction);
        setCurrent(prev => {
            if (direction === "next") return (prev + 1) % spaces.length;
            return (prev - 1 + spaces.length) % spaces.length;
        });
    }, [spaces.length]);

    useEffect(() => {
        if (spaces.length < 2 || paused) return;
        const id = setInterval(() => go("next"), AUTOPLAY_MS);
        return () => clearInterval(id);
    }, [spaces.length, paused, go]);

    if (spaces.length === 0) return null;

    const space = spaces[current];
    const isAvailable = space.status !== false;

    return (
        <div
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="px-6 pt-5 pb-2 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Espacios Destacados</h2>
            </div>

            {/* Slide area */}
            <div className="relative h-36 overflow-hidden">
                <div
                    key={`${current}-${dir}`}
                    className={`absolute inset-0 flex items-center gap-5 px-6 carousel-slide-${dir}`}
                >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 text-2xl">
                        🏫
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant={isAvailable ? "success" : "error"}>
                                {isAvailable ? "Disponible" : "En mantenimiento"}
                            </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                            {space.type} {space.number}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                            Edificio {space.location} &middot; Hasta {space.cupo} personas
                        </p>
                        {/* Stars */}
                        <div className="flex items-center gap-0.5 mt-1 text-yellow-400 text-xs">
                            {Array(5).fill(null).map((_, i) => (
                                <span key={i}>{i < (space.rating || 0) ? ICONS.StarFilled : ICONS.Star}</span>
                            ))}
                            {!space.rating && <span className="text-gray-400 ml-1">Sin reseñas</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {spaces.length > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
                    <button
                        onClick={() => go("prev")}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                        aria-label="Anterior"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="flex items-center gap-1.5">
                        {spaces.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setDir(i > current ? "next" : "prev"); setCurrent(i); }}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    i === current ? "bg-green-600 w-5" : "bg-gray-300 w-2"
                                }`}
                                aria-label={`Ir a slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => go("next")}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                        aria-label="Siguiente"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FeaturedCarousel;
