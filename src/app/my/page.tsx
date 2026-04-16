import Login from '@/components/layout/login';
import Bookings from '@/components/med/bookings';
import BookingsContext from '@/stores/bookings';
import { TabContext, TabSelector } from '@/stores/layoutstate';
import { QRCContext } from '@/stores/qr';
import { IfLogged, IfNotLogged } from '@/stores/user';
import React from 'react';

const My: React.FC = () => {
    return <div className="space-y-8 fade-in">
        <IfLogged>
            <header className="mb-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Reservaciones</h1>
                <p className="text-gray-600">Revisa y administra tus reservaciones</p>
            </header>
        </IfLogged>
        <IfNotLogged>
            <Login/>
        </IfNotLogged>
        <IfLogged>
            <TabContext>
                <div className="flex p-1 rounded-2xl border border-white/5 overflow-x-auto max-w-full justify-around">
                    <TabSelector
                        tab={'activas'}
                    />
                    <TabSelector
                        tab={'completadas'}
                    />
                    <TabSelector
                        tab={'canceladas'}
                    />
                </div>
                <QRCContext>
                    <div className="flex flex-col items-center justify-around gap-6 py-12 px-6 bg-white">
                        <BookingsContext>
                            <Bookings/>
                        </BookingsContext>
                    </div>
                </QRCContext>
            </TabContext>
        </IfLogged>
    </div>;
};
export default My;