import React from 'react';
import { GlassCard } from "@/components/min/legacygeneric";
import LoginContext from '@/stores/login';
import { UserLoginButtons, UserPwdBoxes, UserRemember } from '@/components/min/login';

const Login: React.FC = () => <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="w-full max-w-sm fade-in">
        {/* Header */}
        <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-lg bg-green-600 flex items-center justify-center shadow-md mx-auto mb-3">
                <span className="font-bold text-2xl text-white">L</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">LoboApp</h1>
            <p className="text-sm text-gray-600">Sistema de reservación de espacios</p>
        </div>

        {/* Login Card */}
        <GlassCard className="p-6">
            <form className="space-y-4">
                <LoginContext>
                    {/* Input Fields */}
                    <div className="space-y-3">
                        <UserPwdBoxes/>
                    </div>

                    {/* Remember Me */}
                    <label className="flex items-center gap-2">
                        <UserRemember />
                        <div className="flex items-center gap-2 cursor-pointer flex-1">
                            <span className="text-xs text-gray-700">Recordarme</span>
                        </div>
                    </label>

                    {/* Login Buttons */}
                    <div className="space-y-2 pt-1">
                        <UserLoginButtons>
                            <div className="relative flex items-center justify-center py-2">
                                <div className="absolute w-full border-t border-gray-200"></div>
                                <span className="relative px-3 text-xs font-semibold text-gray-500 bg-white">o</span>
                            </div>
                        </UserLoginButtons>
                    </div>
                </LoginContext>
            </form>

            {/* Support Link */}
            <div className="mt-5 pt-4 border-t border-gray-200 text-center">
                <button className="text-xs font-semibold text-green-600 hover:text-green-700 transition-all">
                    ¿Problemas? Contacta a Soporte
                </button>
            </div>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
            © 2025 LoboApp
        </p>
    </div>
</div>;

export default Login;