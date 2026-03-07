import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#fef9f3' }}>
            <a href="#login-form" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-[#d97757] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg">
                Skip to login form
            </a>
            <div id="login-form" className="max-w-md w-full space-y-5 sm:space-y-6" tabIndex={-1}>
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#d97757' }}>
                        Class Companion
                    </h1>
                    <p className="text-base sm:text-lg mb-3 sm:mb-4" style={{ color: '#7ba884', fontWeight: '700' }}>
                        ESOL Students
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-display)', color: '#2b3a4a' }}>
                        Sign in to continue
                    </h2>
                </div>
                <Suspense fallback={<div className="text-center text-sm" style={{ color: "#5e6f80" }}>Loading login form...</div>}>
                    <LoginForm />
                </Suspense>
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
            </div>
        </div>
    );
}
