import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#fef9f3' }}>
            <div className="max-w-md w-full space-y-5 sm:space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#d97757' }}>
                        Class Companion
                    </h1>
                    <p className="text-sm mb-4 sm:mb-6" style={{ color: '#7ba884', fontWeight: '600' }}>
                        ESOL Level 3
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-display)', color: '#2b3a4a' }}>
                        Sign in to your account
                    </h2>
                </div>
                <div className="border rounded-2xl p-4 sm:p-5 space-y-3" style={{ backgroundColor: '#fffdf9', borderColor: '#e8dece' }}>
                    <p className="text-sm font-semibold" style={{ color: '#2b3a4a' }}>
                        First-time login steps
                    </p>
                    <div className="grid grid-cols-[1.5rem_1fr] items-start gap-x-2 gap-y-2 text-[15px] leading-6" style={{ color: '#405061' }}>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold" style={{ backgroundColor: '#f2e6d6', color: '#8f5b45' }}>1</span>
                        <p>Sign in with your temporary password.</p>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold" style={{ backgroundColor: '#f2e6d6', color: '#8f5b45' }}>2</span>
                        <p>Create a new password.</p>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold" style={{ backgroundColor: '#f2e6d6', color: '#8f5b45' }}>3</span>
                        <p>Sign in again with your new password.</p>
                    </div>
                    <p className="text-xs leading-5" style={{ color: '#5e6f80' }}>
                        Espanol: Entra con tu clave temporal. Luego crea una clave nueva. Despues vuelve a entrar.
                    </p>
                </div>
                <Suspense fallback={<div className="text-center text-sm" style={{ color: "#5e6f80" }}>Loading login form...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
