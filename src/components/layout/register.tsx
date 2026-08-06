import React from 'react';
import { GlassCard } from "@/components/min/legacygeneric";
import RegisterContext from '@/stores/register';
import { RegisterFields, RegisterConsent, RegisterError, RegisterSuccess, RegisterButton } from '@/components/min/register';
import ALink from '@/components/min/alink';

const Register: React.FC = () => <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="w-full max-w-sm fade-in">
        {/* Header */}
        <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-lg bg-green-600 flex items-center justify-center shadow-md mx-auto mb-3">
                <span className="font-bold text-2xl text-white">L</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
            <p className="text-sm text-gray-600">Regístrate en LoboApp</p>
        </div>

        {/* Register Card */}
        <GlassCard className="p-6">
            <form className="space-y-4">
                <RegisterContext>
                    {/* Input Fields */}
                    <div className="space-y-3">
                        <RegisterFields />
                    </div>

                    {/* Consentimiento de protección de datos personales */}
                    <div className="space-y-2 pt-1">
                        <RegisterConsent />
                    </div>

                    <RegisterError />
                    <RegisterSuccess />

                    {/* Submit */}
                    <div className="pt-1">
                        <RegisterButton />
                    </div>
                </RegisterContext>
            </form>

            {/* Back to login */}
            <div className="mt-5 pt-4 border-t border-gray-200 text-center">
                <ALink to="/" classes="text-xs font-semibold text-green-600 hover:text-green-700 transition-all">
                    ¿Ya tienes cuenta? Inicia sesión
                </ALink>
            </div>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
            © 2026 LoboApp
        </p>
    </div>
</div>;

export default Register;
