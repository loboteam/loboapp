"use client";
import { useUser } from '@/stores/user';
import { Button } from '@/components/min/legacygeneric';
import { ICONS } from '@/lib/constants';
import React, { useState } from 'react';
import { BookingContainer, useBookings } from '@/stores/bookings';

export const CancelBooking: React.FC<{data: BookingContainer, date: string }> = ({ data, date }) => {
    const { user } = useUser();
    const { filteredBookings, what } = useBookings();
    const [loading, setLoading] = useState<boolean>(false);

    const cancelBooking = ()=>{
        setLoading(true);
        fetch(`/book?sala=${data.sala}&date=${date}&from=${data.from}`, {method: "DELETE", headers: { "Authorization": "Bearer " + user?.token }})
        .then(r=>{
            if (!r.ok) throw r.text() ?? r.status;
            data.cancelled = true;
        }).catch(console.error)
        .finally(()=>{
            setLoading(false)
            what(()=>filteredBookings.filter(e=>!(e.cancelled)))
        })
    };

    return <Button size="sm" loading={loading} variant="danger" icon={ICONS.Trash} onClick={cancelBooking}>Cancelar</Button>;
};