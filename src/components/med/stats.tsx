"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { GlassCard } from "@/components/min/legacygeneric";
import { useUser } from "@/stores/user";
import { useState } from "react";

interface Weekday {
    num: 'Lun' | 'Mar' | 'Mie' | 'Jue' | 'Vie' | 'Sab';
    val: number
};

export const WeeklyStats: React.FC = () => {
    const { user } = useUser();
    const [weeklyDemand, setWeeklyDemand] = useState<Weekday[]>([]);
    const [todayDemand, setTodayDemand] = useState<number>(12);
    return <>
        <GlassCard className="lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyDemand}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                    <Bar dataKey="val" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </GlassCard>
        <GlassCard>
           <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Pico de Demanda</div>
            <div className="text-2xl font-black text-white tracking-tighter">{todayDemand}</div>
           <div className="text-sm text-slate-500 mt-2 font-medium">Basado en datos de hoy</div>
        </GlassCard>
    </>;
};