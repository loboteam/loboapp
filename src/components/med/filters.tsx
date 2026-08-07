"use client";
import { GlassCard, Input } from "@/components/min/legacygeneric";
import { useSpace } from "@/stores/space";

const Filters: React.FC = () => {
    const { type, setType, time, setTime, cupo, setCupo, edif, setEdif } = useSpace();
    return (
        <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Filtrar espacios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input 
                    label="Tipo de espacio" 
                    value={type} 
                    bindTo={setType} 
                    placeholder="Ej: Sala de estudio" 
                />
                <Input 
                    label="Capacidad mínima" 
                    type="select" 
                    value={cupo} 
                    bindTo={setCupo} 
                    options={[
                        {value: '', label: 'Cualquiera'}, 
                        {value: '4', label: '4 personas'}, 
                        {value: '10', label: '10 personas'}, 
                        {value: '20', label: '20+ personas'}
                    ]} 
                />
                <Input
                    label="Duración"
                    type="select"
                    value={time ?? ''}
                    bindTo={setTime}
                    options={[
                        {value: '', label: 'Cualquiera'},
                        {value: '1', label: '1 Hora'},
                        {value: '2', label: '2 Horas'},
                        {value: '3', label: '3 Horas'}
                    ]}
                />
                <Input 
                    label="Ubicación" 
                    type="select" 
                    value={edif} 
                    bindTo={setEdif} 
                    options={[
                        {value: '', label: 'Todo el Campus'}, 
                        {value: 'Norte', label: 'Ala Norte'}, 
                        {value: 'Sur', label: 'Ala Sur'}
                    ]} 
                />
            </div>
        </GlassCard>
    );
};

export default Filters;