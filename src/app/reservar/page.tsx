import React from 'react';
import Filters from '@/components/med/filters';
import SpaceCollection from '@/components/med/spacecollection';
import SpaceContext from '@/stores/space';
import Reserve from '@/components/med/reserve';
import { IfLogged, IfNotLogged } from '@/stores/user';
import Login from '@/components/layout/login';

const Reservations: React.FC = () => {
    return <div className="space-y-8 fade-in">
        <IfLogged>
            <header className="flex md:flex-col justify-between items-center gap-6">
                <h2 className="text-4xl font-extrabold tracking-tighter text-slate-700">Reserva de Espacios</h2>
                {/*<div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-teal-500"></div> <span>Libre</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-700"></div> <span>Ocupado</span>
                    </div>
                    </div>*/}
            </header>
        </IfLogged>
        <IfNotLogged>
            <Login/>
        </IfNotLogged>
        <IfLogged>
            <SpaceContext>
                <Filters />

                <div className="grid grid-cols-3 gap-6">
                    <SpaceCollection/>
                </div>

                <Reserve/>

            </SpaceContext>
        </IfLogged>
    </div>;
};

export default Reservations;