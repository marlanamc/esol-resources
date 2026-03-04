"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Users, TrendingDown, BarChart3, Clock3 } from "lucide-react";

interface SkillData {
    skillTag: string;
    totalAttempts: number;
    correctAttempts: number;
    percentCorrect: number;
    studentsStruggling: number;
    studentsSeen: number;
    strugglingStudents: Array<{
        id: string;
        name: string;
        username: string;
        percentCorrect: number;
    }>;
}

interface QuestionData {
    questionId: string;
    question: string;
    skillTag: string;
    difficulty: string;
    totalAttempts: number;
    correctAttempts: number;
    percentCorrect: number;
    studentsStruggling: number;
    strugglingStudents: Array<{
        id: string;
        name: string;
        username: string;
        percentCorrect: number;
    }>;
}

interface TrendData {
    recentAccuracy: number | null;
    previousAccuracy: number | null;
    delta: number | null;
    recentResponses: number;
    previousResponses: number;
}

interface DiagnosticsResponse {
    totalStudents: number;
    studentsAttempted: number;
    attemptRate: number;
    totalResponses: number;
    overallAccuracy: number;
    latestAttemptAt: string | null;
    trend: TrendData;
    skills: SkillData[];
    questions: QuestionData[];
}

interface DiagnosticReportProps {
    classId: string;
    activityId: string;
    totalStudents: number;
}

export function DiagnosticReport({ classId, activityId, totalStudents }: DiagnosticReportProps) {
    const [report, setReport] = useState<DiagnosticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<string>("all");
    const [showOnlyNeedsHelp, setShowOnlyNeedsHelp] = useState<boolean>(false);

    const fetchDiagnostics = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({ classId, activityId });
            if (difficulty !== "all") params.set("difficulty", difficulty);

            const res = await fetch(`/api/diagnostics/class-skills?${params}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch diagnostics");
            }

            const data = (await res.json()) as DiagnosticsResponse;
            setReport(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [classId, activityId, difficulty]);

    useEffect(() => {
        fetchDiagnostics();
    }, [fetchDiagnostics]);

    const formatSkillTag = (tag: string) =>
        tag.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    const getColorClasses = (percent: number) => {
        if (percent >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
        if (percent >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
        return "text-rose-700 bg-rose-50 border-rose-200";
    };

    const getProgressBarColor = (percent: number) => {
        if (percent >= 80) return "bg-emerald-500";
        if (percent >= 60) return "bg-amber-500";
        return "bg-rose-500";
    };

    const skills = report?.skills || [];
    const questions = report?.questions || [];
    const visibleSkills = showOnlyNeedsHelp
        ? skills.filter((s) => s.studentsStruggling > 0)
        : skills;
    const visibleQuestions = showOnlyNeedsHelp
        ? questions.filter((q) => q.studentsStruggling > 0)
        : questions;
    const skillsNeedingReview = skills.filter((s) => s.percentCorrect < 60);
    const toughestSkill = skills[0] || null;
    const toughestQuestion = questions[0] || null;
    const questionHotspots = visibleQuestions.slice(0, 5);
    const trend = report?.trend || null;

    const trendLabel = (() => {
        if (!trend || trend.delta === null) return "Not enough history yet";
        if (trend.delta > 0) return `Improving (+${trend.delta} pts vs previous 7 days)`;
        if (trend.delta < 0) return `Declining (${trend.delta} pts vs previous 7 days)`;
        return "Flat trend (no change vs previous 7 days)";
    })();

    return (
        <div className="bg-white rounded-xl border border-border shadow-lg overflow-hidden">
            <div className="p-6 border-b border-border bg-bg-light">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-text mb-1">Mini-Quiz Diagnostics</h2>
                        <p className="text-sm text-text-muted flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {report?.totalStudents ?? totalStudents} students enrolled
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 text-sm font-medium text-text">
                            <input
                                type="checkbox"
                                checked={showOnlyNeedsHelp}
                                onChange={(e) => setShowOnlyNeedsHelp(e.target.checked)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                            />
                            Only show students needing help
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy Only</option>
                            <option value="medium">Medium Only</option>
                            <option value="hard">Hard Only</option>
                        </select>
                    </div>
                </div>

                {!loading && report && report.totalResponses > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className="text-xl font-bold text-text">{report.studentsAttempted}</div>
                            <div className="text-xs text-text-muted">Students Attempted</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className="text-xl font-bold text-text">{report.attemptRate}%</div>
                            <div className="text-xs text-text-muted">Class Coverage</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className="text-xl font-bold text-text">{report.overallAccuracy}%</div>
                            <div className="text-xs text-text-muted">Overall Accuracy</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className="text-xl font-bold text-rose-600">{skillsNeedingReview.length}</div>
                            <div className="text-xs text-text-muted">Skills &lt;60%</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className="text-xl font-bold text-amber-600">{report.totalResponses}</div>
                            <div className="text-xs text-text-muted">Tagged Responses</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-border">
                            <div className={`text-xl font-bold ${trend && trend.delta !== null && trend.delta < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                {trend && trend.delta !== null ? `${trend.delta > 0 ? "+" : ""}${trend.delta}` : "—"}
                            </div>
                            <div className="text-xs text-text-muted">7-Day Trend</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="text-center py-12 text-text-muted">
                        <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"></div>
                        Loading diagnostics...
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-rose-600 bg-rose-50 rounded-lg">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-semibold mb-2">Error loading diagnostics</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : !report || report.totalResponses === 0 ? (
                    <div className="text-center py-12 text-text-muted bg-bg-light rounded-lg">
                        <TrendingDown className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                        <p className="font-semibold mb-2">No diagnostic data available</p>
                        <p className="text-sm">Students need to complete mini-quizzes with skill tags to generate diagnostics.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Actionable Insights
                            </h3>
                            <p className="text-sm text-slate-700">
                                Coverage: {report.studentsAttempted}/{report.totalStudents} students have attempted this quiz ({report.attemptRate}%).
                            </p>
                            <p className="text-sm text-slate-700">
                                Trend: {trendLabel}.
                            </p>
                            {toughestSkill && (
                                <p className="text-sm text-slate-700">
                                    Biggest skill gap: <strong>{formatSkillTag(toughestSkill.skillTag)}</strong> at {toughestSkill.percentCorrect}% ({toughestSkill.studentsStruggling} students below 60%).
                                </p>
                            )}
                            {toughestQuestion && (
                                <p className="text-sm text-slate-700">
                                    Hardest question: <strong>{toughestQuestion.percentCorrect}% correct</strong> on "{toughestQuestion.question}".
                                </p>
                            )}
                            {report.latestAttemptAt && (
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                                    <Clock3 className="w-3 h-3" />
                                    Last attempt: {new Date(report.latestAttemptAt).toLocaleString()}
                                </p>
                            )}
                        </div>

                        {skillsNeedingReview.length > 0 && (
                            <div className="bg-rose-50 border-2 border-rose-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-rose-800 mb-1">
                                            {skillsNeedingReview.length} skill{skillsNeedingReview.length !== 1 ? "s" : ""} need targeted reteaching
                                        </h3>
                                        <p className="text-sm text-rose-700">
                                            Focus first on high-volume skills below 60%, then re-check with the diagnostics trend over the next week.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <section>
                            <h3 className="text-lg font-semibold text-text mb-3">Skill Breakdown</h3>
                            <div className="space-y-4">
                                {visibleSkills.map((skill) => (
                                    <div
                                        key={skill.skillTag}
                                        className={`p-5 rounded-lg border-2 transition-all hover:shadow-md ${getColorClasses(skill.percentCorrect)}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg mb-1">{formatSkillTag(skill.skillTag)}</h4>
                                                <p className="text-sm opacity-80">
                                                    {skill.correctAttempts} / {skill.totalAttempts} answers correct
                                                </p>
                                                <p className="text-xs opacity-70 mt-1">
                                                    Seen by {skill.studentsSeen} student{skill.studentsSeen !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold">{skill.percentCorrect}%</div>
                                                {skill.percentCorrect >= 80 && (
                                                    <CheckCircle2 className="w-5 h-5 inline-block ml-2 text-emerald-600" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full h-3 bg-white/60 rounded-full mb-3 overflow-hidden">
                                            <div
                                                className={`h-full ${getProgressBarColor(skill.percentCorrect)} transition-[width] duration-500 ease-out`}
                                                style={{ width: `${skill.percentCorrect}%` }}
                                            />
                                        </div>

                                        {skill.studentsStruggling > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm font-semibold">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {skill.studentsStruggling} student{skill.studentsStruggling !== 1 ? "s" : ""} below 60%
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {skill.strugglingStudents.map((student) => (
                                                        <Link
                                                            key={`${skill.skillTag}-${student.id}`}
                                                            href={`/dashboard/students/${student.id}`}
                                                            className="inline-flex items-center gap-1 rounded-full border border-current/20 bg-white/70 px-2 py-1 text-xs font-medium hover:bg-white"
                                                        >
                                                            <span>{student.name}</span>
                                                            <span className="opacity-70">({student.percentCorrect}%)</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {visibleSkills.length === 0 && (
                                    <div className="rounded-lg border border-border bg-bg-light p-4 text-sm text-text-muted">
                                        No skills currently have students below 60% for this filter.
                                    </div>
                                )}
                            </div>
                        </section>

                        {questionHotspots.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold text-text mb-3">Top Question Hotspots</h3>
                                <div className="space-y-3">
                                    {questionHotspots.map((question) => (
                                        <div
                                            key={question.questionId}
                                            className={`rounded-lg border p-4 ${getColorClasses(question.percentCorrect)}`}
                                        >
                                            <p className="text-sm font-semibold mb-1">{question.question}</p>
                                            <p className="text-xs opacity-80 mb-2">
                                                Skill: {formatSkillTag(question.skillTag)} • Difficulty: {question.difficulty}
                                            </p>
                                            <div className="flex items-center justify-between text-sm">
                                                <span>{question.correctAttempts}/{question.totalAttempts} correct</span>
                                                <span className="font-bold">{question.percentCorrect}%</span>
                                            </div>
                                            {question.strugglingStudents.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {question.strugglingStudents.map((student) => (
                                                        <Link
                                                            key={`${question.questionId}-${student.id}`}
                                                            href={`/dashboard/students/${student.id}`}
                                                            className="inline-flex items-center gap-1 rounded-full border border-current/20 bg-white/70 px-2 py-1 text-xs font-medium hover:bg-white"
                                                        >
                                                            <span>{student.name}</span>
                                                            <span className="opacity-70">({student.percentCorrect}%)</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            {skills.length > 0 && (
                <div className="px-6 py-4 border-t border-border bg-bg-light">
                    <p className="text-xs text-text-muted mb-3 font-semibold">Performance Levels:</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-emerald-500"></div>
                            <span>Mastered (80%+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-amber-500"></div>
                            <span>Developing (60-79%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-rose-500"></div>
                            <span>Needs Review (&lt;60%)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
