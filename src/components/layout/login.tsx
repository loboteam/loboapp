import React from 'react';
import { GlassCard, Button, Input } from "@/components/min/legacygeneric";
import { APP_THEME } from "@/lib/constants";
import LoginContext from '@/stores/login';
import { UserLoginButtons, UserPwdBoxes, UserRemember } from '@/components/min/login';

const Login: React.FC = () => <div className="relative w-full flex items-center justify-center overflow-hidden">
    {/* Background Orbs */}
    <div className="absolute top-1/4 -left-20 w-125 h-125 bg-teal-500/4 rounded-full blur-[120px] animate-pulse"></div>
    <div className="absolute bottom-1/4 -right-20 w-125 h-125 bg-blue-500/4 rounded-full blur-[120px] animate-pulse"></div>

    <div className="w-full relative z-10 fade-in">
        <div className="text-center mb-10 space-y-4">
            <div className={`w-20 h-20 rounded-4xl bg-linear-to-br ${APP_THEME.gradientPrimary} flex items-center justify-center shadow-2xl shadow-teal-500/40 mx-auto transform rotate-12`}>
                <span className="font-black text-4xl -rotate-12">L</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
                LoboApp
            </h1>
        </div>
        <GlassCard className="p-10">
            <form className="space-y-6"><LoginContext>
                <div className="space-y-4">
                    <UserPwdBoxes/>
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <UserRemember />
                        <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center group-has-checked:bg-teal-500 transition-all">
                            <div className="w-1.5 h-1.5 rounded-sm bg-white opacity-0 group-has-checked:opacity-100 transition-all"></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Recordarme</span>
                    </label>
                    <button type="button" className="text-[10px] font-bold text-teal-400 uppercase tracking-widest hover:text-teal-300 transition-all">¿Ayuda?</button>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4">
                    <UserLoginButtons>
                        <div className="relative flex items-center justify-center py-2">
                        <div className="absolute w-full border-t border-white/5"></div>
                        <span className="relative px-3 text-[10px] font-black text-slate-950 uppercase tracking-widest">o</span>
                        </div>
                    </UserLoginButtons>
                </div>
            </LoginContext></form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-slate-500 font-medium">¿Problemas con tu cuenta?</p>
                <button className="mt-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-all uppercase tracking-widest">
                    Contacta a Soporte
                </button>
            </div>
        </GlassCard>
    </div>
</div>;

export default Login;