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
            <header className="mb-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Reserva de Espacios</h1>
                <p className="text-gray-600">Encuentra y reserva los espacios disponibles en el campus</p>
            </header>
        </IfLogged>
        <IfNotLogged>
            <Login/>
        </IfNotLogged>
        <IfLogged>
            <SpaceContext>
                <Filters />
                <SpaceCollection/>
                <Reserve/>
            </SpaceContext>
        </IfLogged>
    </div>;
};

export default Reservations;