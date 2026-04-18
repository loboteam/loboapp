"use client";
import { useTabs } from "@/stores/layoutstate";
import { useUser } from "@/stores/user";
import React, { useEffect, useState } from "react";
import Booking from "@/components/min/booking";
import ALink from "@/components/min/alink";
import { BookingContainer, useBookings } from "@/stores/bookings";

const Bookings: React.FC<{}> = () => {
    const { currentTab } = useTabs();
    const { user } = useUser();
    const { bookings, setBookings, filteredBookings, what } = useBookings();
    const [loading, setLoading] = useState<number>(0);

    const fletcher = () => {
        if (loading === 0) {
            fetch("/records", { headers: { "Authorization": "Bearer " + user?.token } }).then(r => r.json() as Promise<BookingContainer[]>).then(setBookings).then(() => setLoading(0)).catch(e => { console.error(e); setBookings([]); setLoading(-1) });
            setLoading(1);
        }
    };

    useEffect(fletcher, []);
    useEffect(()=>{
        setLoading(1);
        what(bookings.filter(b => {
            const D = new Date();
            const day = new Date(b.day);
            const done = day.getFullYear() < D.getFullYear() || day.getMonth() < D.getMonth() || day.getDate() < D.getDate() || b.from < D.getHours();
            switch (currentTab) {
                case "activas":
                    return !(done) && !(b.cancelled)
                case "canceladas":
                    return b.cancelled;
                case "completadas":
                    return done && !(b.cancelled);
            }
        }));
        setLoading(0);
    },[bookings, currentTab])

    if (loading === 1) return <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full spinner mb-4"></div>
        <p className="text-gray-600 font-semibold">Cargando resultados...</p>
    </div>;
    if (loading < 0 || loading > 1) return <h4 className="text-red-700">you've met a terrible fate, haven't you?</h4>;

    if (filteredBookings.length === 0 || !filteredBookings.map) return (
        <>
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.305 3.305a7.5 7.5 0 0010.345 10.345z" />
            </svg>
            <p className="text-gray-600 font-semibold mb-2">Sin reservaciones {currentTab !== "activas" ? currentTab : "hechas"}!</p>
            {currentTab === "activas" ? <p className="text-gray-500 text-sm">Ve a la pesta&ntilde;a <ALink to="/reservar">Reservar</ALink> si requieres hacer una.</p> : null}
        </>
    );
    return <>{filteredBookings.map((e,i)=><Booking key={i} data={e} />)}</>;
};

export default Bookings;