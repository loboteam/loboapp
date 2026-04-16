import React from 'react';
import { Badge, GlassCard } from '@/components/min/legacygeneric';
import { QRButton } from '@/stores/qr';
import { BookingContainer } from '@/stores/bookings';
import { CancelBooking } from '@/components/min/bookingbuttons';

const Booking: React.FC<{data: BookingContainer}> = ({data}) =>{
    const d = new Date(data.day);
    const minData = { day: d, from: data.from, sala: data.sala };
    return <GlassCard className="border-white/5 hover:bg-white/3 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{data.sala_data.type} {data.sala_data.number}</h3>
                    <Badge variant="success">{data.cancelled ? "Cancelada" : data.done ? "Completada" : "Activa"}</Badge>
                </div>
                <p className="text-sm text-slate-400">Edificio {data.sala_data.location} • {d.toLocaleDateString(navigator.userLanguage ?? navigator.language, { weekday: "long", month: 'long', day: 'numeric' })} • {data.from}:00–{data.to}:00</p>
            </div>
            {!(data.cancelled || data.done) && <div className="flex gap-2">
                <QRButton data={minData} />
                <CancelBooking data={data} date={`${d.getFullYear()}-${d.getMonth() < 9 && "0" || ""}${d.getMonth() + 1}-${d.getDate() < 9 && "0" || ""}${d.getDate()}`} />
            </div>}
        </div>
    </GlassCard>
};

export default Booking;