import { GlassCard, AnimatedCard } from "@/components/min/legacygeneric";
import { ICONS } from "@/lib/constants";
import { IfAdmin, IfLogged, IfNotAdmin, IfNotLogged } from '@/stores/user';
import { FirstName } from '@/components/min/usermins';
import ALink from '@/components/min/alink';
import Login from "@/components/layout/login";
import FeaturedCarousel from "@/components/med/carousel";

const Dash = () => <div className="space-y-8 fade-in">
    <IfLogged>
        <header className="mb-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    <IfAdmin>Panel de Administración</IfAdmin>
                    <IfNotAdmin>Bienvenido, <FirstName/></IfNotAdmin>
                </h1>
                <p className="text-gray-600">
                    <IfAdmin>Gestiona todos los espacios y reservaciones del campus</IfAdmin>
                    <IfNotAdmin>Sistema de reservación de espacios universitarios</IfNotAdmin>
                </p>
            </div>
        </header>
    </IfLogged>
    <IfNotLogged>
        <Login/>
    </IfNotLogged>

    <IfLogged>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedCard delay={0}>
            <ALink to="/reservar">
                <GlassCard hover className="h-full group">
                    <div className="flex flex-col items-start">
                        <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                            {ICONS.Reservations}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Nueva Reservación</h3>
                        <p className="text-sm text-gray-600">Reserva un espacio disponible en el campus</p>
                    </div>
                </GlassCard>
            </ALink>
            </AnimatedCard>

            <AnimatedCard delay={100}>
            <ALink to="/mis-reservas">
                <GlassCard hover className="h-full group">
                    <div className="flex flex-col items-start">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                            {ICONS.MyReservations}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Mis Reservas</h3>
                        <p className="text-sm text-gray-600">Consulta y gestiona tus reservaciones</p>
                    </div>
                </GlassCard>
            </ALink>
            </AnimatedCard>

            <IfAdmin>
                <AnimatedCard delay={200}>
                <ALink to="/admin">
                    <GlassCard hover className="h-full group">
                        <div className="flex flex-col items-start">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                {ICONS.Stats}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Estadísticas</h3>
                            <p className="text-sm text-gray-600">Analiza el rendimiento del campus</p>
                        </div>
                    </GlassCard>
                </ALink>
                </AnimatedCard>
            </IfAdmin>
        </div>

        {/* Featured Carousel */}
        <AnimatedCard delay={100}>
            <FeaturedCarousel />
        </AnimatedCard>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <AnimatedCard delay={0}>
                <GlassCard>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Avisos Importantes</h3>
                    <ul className="space-y-3">
                        {[
                            'Actualización de políticas de reserva para el próximo ciclo.',
                            'Nuevo laboratorio de Robótica disponible en el Piso 4.',
                            'Mantenimiento programado de servidores este domingo.'
                        ].map((msg, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-700 items-start">
                                <div className="mt-1 text-green-600 flex-shrink-0">{ICONS.Check}</div>
                                <span>{msg}</span>
                            </li>
                        ))}
                    </ul>
                </GlassCard>
            </AnimatedCard>

            <AnimatedCard delay={150}>
                <GlassCard>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Estado del Sistema</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-3xl font-bold text-green-600">08</div>
                            <div className="text-xs font-semibold text-green-700 mt-2">Espacios Disponibles</div>
                        </div>
                        <IfLogged>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-3xl font-bold text-blue-600">12</div>
                                <div className="text-xs font-semibold text-blue-700 mt-2">Tus Puntos</div>
                            </div>
                        </IfLogged>
                    </div>
                </GlassCard>
            </AnimatedCard>
        </div>
    </IfLogged>
</div>;

export default Dash;