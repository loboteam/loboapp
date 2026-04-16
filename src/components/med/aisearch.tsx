"use client";
import React, { useState, useRef } from "react";
import { useSpace } from "@/stores/space";
import { SpaceParams } from "@/stores/space";

const SUGGESTIONS = [
    "Sala de lectura para menos de 10 personas",
    "Laboratorio en el edificio F",
    "Espacio grande para trabajo en grupo",
    "Sala de descanso pequeña en la biblioteca",
];

const AISearch: React.FC = () => {
    const { setSpaces, aiExplanation, setAiExplanation } = useSpace();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const search = async (q: string) => {
        if (!q.trim()) return;
        setLoading(true);
        setError(null);
        setAiExplanation(null);

        try {
            const res = await fetch("/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: q }),
            });
            const data = await res.json();
            if (!res.ok) {
                setSpaces(null);
                throw new Error(data.error ?? "Error desconocido");
            }
            setSpaces(data.rooms as SpaceParams[]);
            setAiExplanation(data.explanation ?? null);
        } catch (e: any) {
            setError(e.message ?? "No se pudo conectar con el buscador.");
        } finally {
            setLoading(false);
        }
    };

    const clear = () => {
        setQuery("");
        setAiExplanation(null);
        setError(null);
        setSpaces(null);
    };

    return (
        <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.344.344a3.75 3.75 0 01-5.304 0l-.344-.344z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Búsqueda inteligente</h3>
                    <p className="text-xs text-gray-500">Describe con tus palabras lo que necesitas</p>
                </div>
            </div>

            {/* Input row */}
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && search(query)}
                    placeholder="Ej: necesito una sala silenciosa para 10 personas..."
                    className="flex-1 border border-green-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400 text-sm"
                    disabled={loading}
                />
                {query && (
                    <button
                        onClick={clear}
                        className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Limpiar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
                <button
                    onClick={() => search(query)}
                    disabled={loading || !query.trim()}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.305 3.305a7.5 7.5 0 0010.345 10.345z" />
                        </svg>
                    )}
                    Buscar
                </button>
            </div>

            {/* Suggestions */}
            {!aiExplanation && !error && (
                <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => { setQuery(s); search(s); }}
                            className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-50 hover:border-green-400 transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* AI explanation chip */}
            {aiExplanation && (
                <div className="flex items-center gap-2 bg-white border border-green-200 rounded-lg px-4 py-2.5">
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-700">Entendí: </span>{aiExplanation}
                    </p>
                    <button
                        onClick={clear}
                        className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                        Limpiar
                    </button>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
        </div>
    );
};

export default AISearch;