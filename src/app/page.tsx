import Link from "next/link";
import { BookOpen, CheckSquare, Target } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{
            background: "linear-gradient(135deg, #fdfbf7 0%, #f4f1ea 50%, #e9e6df 100%)"
        }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-12 sm:py-20 flex flex-col gap-16">
                {/* Header */}
                <header className="text-center space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <p className="text-xs sm:text-sm uppercase tracking-[0.15em] text-primary-dark font-semibold">
                            ESOL Learning Platform
                        </p>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-text">
                        <span className="inline-block">Class</span>{" "}
                        <span className="inline-block relative">
                            Companion
                            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10C52 4 148 -2 298 10" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Your daily home for grammar guides, vocabulary practice, and assignments —
                        <span className="font-semibold text-primary"> built for English learners</span> and their teachers.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/login"
                            className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                        >
                            <span>Student Login</span>
                            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-secondary text-secondary-dark font-semibold hover:bg-secondary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            Teacher Login
                        </Link>
                    </div>
                </header>

                {/* Features */}
                <main className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <FeatureCard
                        icon={BookOpen}
                        title="Grammar Guides"
                        desc="Step-by-step Present, Past, Future, and Continuous tenses with clear examples and interactive exercises."
                        accentColor="primary"
                    />
                    <FeatureCard
                        icon={CheckSquare}
                        title="Assignments & Quizzes"
                        desc="Start class activities, submit work, and track your progress with streaks and achievement points."
                        accentColor="secondary"
                    />
                    <FeatureCard
                        icon={Target}
                        title="Vocabulary Practice"
                        desc="Flashcards and interactive games designed for ESOL Level 3 to build confidence quickly."
                        accentColor="accent"
                    />
                </main>

                {/* Footer */}
                <footer className="text-center text-text-muted text-sm pt-8 border-t border-border">
                    <p>© {new Date().getFullYear()} Class Companion • Made with ❤️ for English learners</p>
                </footer>
            </div>
        </div>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    desc,
    accentColor
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
    accentColor: "primary" | "secondary" | "accent";
}) {
    const colorClasses = {
        primary: "from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40",
        secondary: "from-secondary/5 to-secondary/10 border-secondary/20 hover:border-secondary/40",
        accent: "from-accent/5 to-accent/10 border-accent/20 hover:border-accent/40"
    };

    const iconBgClasses = {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary-dark",
        accent: "bg-accent/20 text-accent-dark"
    };

    return (
        <div className={`group relative rounded-2xl bg-gradient-to-br ${colorClasses[accentColor]} border-2 backdrop-blur-sm p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${iconBgClasses[accentColor]} mb-4 transition-transform group-hover:scale-110`}>
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3 text-text">{title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
