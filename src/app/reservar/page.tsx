import React from 'react';
import Filters from '@/components/med/filters';
import AISearch from '@/components/med/aisearch';
import SpaceCollection from '@/components/med/spacecollection';
import SpaceContext from '@/stores/space';
import Book from '@/components/med/book';
import { IfAdmin, IfLogged, IfNotLogged } from '@/stores/user';
import Login from '@/components/layout/login';
import { RegisterSpace } from '@/components/min/admin';

const Reservations: React.FC = () => {
    return <div className="space-y-8 fade-in">
        <IfNotLogged>
            <Login/>
        </IfNotLogged>
        <IfLogged>
            <header className="mb-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Reserva de Espacios</h1>
                <p className="text-gray-600">Encuentra y reserva los espacios disponibles en el campus</p>
            </header>
            <SpaceContext>
                <IfAdmin><RegisterSpace></RegisterSpace></IfAdmin>
                <AISearch />
                <Filters />
                <SpaceCollection/>
                <Book/>
            </SpaceContext>
        </IfLogged>
    </div>;
};

export default Reservations;