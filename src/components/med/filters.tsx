"use client";
import { GlassCard, Input } from "@/components/min/legacygeneric";
import { useSpace } from "@/stores/space";

const Filters: React.FC = () => {
    const { type, setType, time, setTime, cupo, setCupo, rating, setRating, edif, setEdif } = useSpace();
    return <GlassCard className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 border-white/5">
        <Input label="Tipo" value={type} bindTo={setType} placeholder="Sala de estudio" />
        {/*<Input label="Hora" type="time" value={time} bindTo={setTime} />*/}
        <Input label="Capacidad" type="select" value={cupo} bindTo={setCupo} options={[{value: '', label: 'Cualquiera'}, {value: '4', label: '4+'}, {value: '10', label: '10+'}, {value: '20', label: '20+'}]} />
        <Input label="Duración" type="select" options={[{value: '1', label: '1 Hora'}, {value: '2', label: '2 Horas'}, {value: '3', label: '3 Horas'}]} />
        {/*<Input label="Calificación" type="select" value={rating} bindTo={setRating} options={[{value: '', label: 'Cualquiera'}, {value: '4', label: '4★+'}, {value: '4.5', label: '4.5★+'}]} />*/}
        <Input label="Ubicación" type="select" value={edif} bindTo={setEdif} options={[{value: '', label: 'Todo el Campus'}, {value: 'Norte', label: 'Ala Norte'}, {value: 'Sur', label: 'Ala Sur'}]} />
    </GlassCard>
};

export default Filters;