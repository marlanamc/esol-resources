import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-bg to-bg-light flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="text-7xl mb-6">🔒</div>
                    <h1 className="text-4xl font-bold text-text mb-4 font-display">Session Expired</h1>
                    <p className="text-text-muted text-lg mb-8">
                        Your session has expired. Please log in again to continue.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-border/30">
                    <Link
                        href="/login"
                        className="block w-full px-6 py-4 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all shadow-md hover:shadow-lg text-lg"
                    >
                        Back to Login
                    </Link>
                </div>

                <p className="mt-6 text-sm text-text-muted">
                    Need help? Contact your teacher.
                </p>
            </div>
        </div>
    );
}
