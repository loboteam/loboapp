import React from 'react';
import Login from '@/components/layout/login';
import { IfAdmin, IfNotAdmin, IfNotLogged } from '@/stores/user';
import { WeeklyStats } from '@/components/med/stats';
import { RegisterSpace } from '@/components/min/admin';

const Admin: React.FC = () => {
    return <div className="space-y-8 fade-in">
        <IfNotLogged>
            <Login/>
        </IfNotLogged>
        <IfNotAdmin>
            <h1>403</h1>
            <p>usté aquí no va</p>
        </IfNotAdmin>
        <IfAdmin>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Panel de Administración</h1>
            </header>
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Espacios</h2>
                  <RegisterSpace></RegisterSpace>
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <h3 className="text-xl font-bold text-white mb-8">Flujo de Usuarios Semanal</h3>
                <div className="h-87.5">
                    <WeeklyStats/>
                </div>
            </div>
        </IfAdmin>
    </div>
};

export default Admin;