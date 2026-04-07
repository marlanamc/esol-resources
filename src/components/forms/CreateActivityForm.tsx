"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type QuizQuestionType = "text" | "single" | "multiple";

type QuizQuestion = {
    id: number;
    question: string;
    type: QuizQuestionType;
    options: string[];
};

export default function CreateActivityForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("worksheet");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [contentType, setContentType] = useState("simple"); // simple, quiz, structured
    const [content, setContent] = useState("");
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([{ id: 1, question: "", type: "text", options: [] }]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Timed writing fields
    type WritingPromptDraft = { text: string; imageUrl: string; starters: string; vocab: string };
    const [writingPrompts, setWritingPrompts] = useState<WritingPromptDraft[]>([
        { text: "", imageUrl: "", starters: "", vocab: "" },
    ]);
    const [writingTimerSeconds, setWritingTimerSeconds] = useState(300);
    const [writingShowWordCount, setWritingShowWordCount] = useState(true);
    const [imageInputMode, setImageInputMode] = useState<("upload" | "url")[]>(["upload"]);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleImageUpload = async (index: number, file: File) => {
        setUploadError(null);
        setUploadingIndex(index);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload/image", { method: "POST", body: fd });
            const data = await res.json() as { url?: string; error?: string };
            if (!res.ok) throw new Error(data.error ?? "Upload failed");
            updateWritingPrompt(index, "imageUrl", data.url!);
        } catch (e) {
            setUploadError(e instanceof Error ? e.message : "Upload failed");
        } finally {
            setUploadingIndex(null);
        }
    };

    const getImageMode = (index: number): "upload" | "url" => imageInputMode[index] ?? "upload";
    const setImageMode = (index: number, mode: "upload" | "url") => {
        setImageInputMode((prev) => { const next = [...prev]; next[index] = mode; return next; });
    };

    const updateWritingPrompt = (index: number, field: keyof WritingPromptDraft, value: string) => {
        setWritingPrompts((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    };
    const addWritingPrompt = () => {
        if (writingPrompts.length < 3) setWritingPrompts((prev) => [...prev, { text: "", imageUrl: "", starters: "", vocab: "" }]);
    };
    const removeWritingPrompt = (index: number) => {
        if (writingPrompts.length > 1) setWritingPrompts((prev) => prev.filter((_, i) => i !== index));
    };

    const addQuizQuestion = () => {
        setQuizQuestions([...quizQuestions, {
            id: quizQuestions.length + 1,
            question: "",
            type: "text",
            options: [],
        }]);
    };

    const updateQuizQuestion = <K extends keyof QuizQuestion>(index: number, field: K, value: QuizQuestion[K]) => {
        const updated = [...quizQuestions];
        updated[index] = { ...updated[index], [field]: value };
        setQuizQuestions(updated);
    };

    const removeQuizQuestion = (index: number) => {
        setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        let activityContent;
        if (type === "writing") {
            if (!writingPrompts[0]?.text.trim()) {
                setError("At least one writing prompt is required");
                return;
            }
            const prompts = writingPrompts
                .filter((p) => p.text.trim())
                .map((p) => ({
                    text: p.text.trim(),
                    imageUrl: p.imageUrl.trim() || undefined,
                    suggestions: (p.starters.trim() || p.vocab.trim()) ? {
                        starters: p.starters.split(",").map((s) => s.trim()).filter(Boolean),
                        vocab: p.vocab.split(",").map((v) => v.trim()).filter(Boolean),
                    } : undefined,
                }));
            activityContent = JSON.stringify({
                type: "writing",
                prompts,
                timerSeconds: writingTimerSeconds,
                showWordCount: writingShowWordCount,
            });
        } else if (contentType === "quiz") {
            const validQuestions = quizQuestions.filter((q) => q.question.trim());
            if (validQuestions.length === 0) {
                setError("Please add at least one question");
                return;
            }
            activityContent = JSON.stringify({ questions: validQuestions });
        } else {
            if (!content.trim()) {
                setError("Content is required");
                return;
            }
            activityContent = JSON.stringify({ content });
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    type,
                    category: category || null,
                    level: level || null,
                    content: activityContent,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create activity");
            }

            router.push("/dashboard/activities");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create activity");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--surface-elevated)] shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                        
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                autoComplete="off"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                autoComplete="off"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Type *
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="worksheet">Worksheet</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="slides">Slides</option>
                                    <option value="guide">Guide</option>
                                    <option value="game">Game</option>
                                    <option value="resource">Resource</option>
                                    <option value="writing">Timed Writing</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select category</option>
                                    <option value="grammar">Grammar</option>
                                    <option value="vocab">Vocabulary</option>
                                    <option value="speaking">Speaking</option>
                                    <option value="writing-reading">Writing/Reading</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Level
                                </label>
                                <select
                                    id="level"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content Type */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content</h3>

                        {type === "writing" ? (
                            <div className="space-y-6">
                                {/* Prompts */}
                                {writingPrompts.map((prompt, index) => (
                                    <div key={index} className="border border-gray-200 dark:border-white/10 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                {writingPrompts.length > 1 ? `Prompt ${index + 1}` : "Writing Prompt"}
                                            </h4>
                                            {writingPrompts.length > 1 && (
                                                <button type="button" onClick={() => removeWritingPrompt(index)} className="text-red-500 text-sm hover:text-red-700">Remove</button>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Prompt Text *</label>
                                            <textarea
                                                value={prompt.text}
                                                onChange={(e) => updateWritingPrompt(index, "text", e.target.value)}
                                                rows={3}
                                                className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white text-sm"
                                                placeholder="Describe a time when you felt proud of something you accomplished at work…"
                                            />
                                        </div>
                                        {/* Image input: upload or paste URL */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Image <span className="font-normal text-gray-400">(optional)</span>
                                                </label>
                                                <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-white/10 text-xs">
                                                    {(["upload", "url"] as const).map((mode) => (
                                                        <button
                                                            key={mode}
                                                            type="button"
                                                            onClick={() => setImageMode(index, mode)}
                                                            className={`px-2.5 py-1 transition-colors ${getImageMode(index) === mode ? "bg-indigo-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                                                        >
                                                            {mode === "upload" ? "📎 Upload" : "🔗 URL"}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {getImageMode(index) === "upload" ? (
                                                <div
                                                    className="relative flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed border-gray-300 dark:border-white/20 px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                                    onClick={() => fileInputRefs.current[index]?.click()}
                                                >
                                                    <input
                                                        ref={(el) => { fileInputRefs.current[index] = el; }}
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                                        className="sr-only"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleImageUpload(index, file);
                                                        }}
                                                    />
                                                    {uploadingIndex === index ? (
                                                        <span className="text-indigo-500">Uploading…</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-xl">🖼️</span>
                                                            <span>Click to upload a photo</span>
                                                            <span className="text-xs text-gray-400">JPEG, PNG, WebP or GIF · max 5 MB</span>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <input
                                                    type="url"
                                                    value={prompt.imageUrl}
                                                    onChange={(e) => updateWritingPrompt(index, "imageUrl", e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white text-sm"
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            )}

                                            {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}

                                            {/* Preview */}
                                            {prompt.imageUrl && (
                                                <div className="mt-2 relative">
                                                    <img
                                                        src={prompt.imageUrl}
                                                        alt="Prompt preview"
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateWritingPrompt(index, "imageUrl", "")}
                                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sentence starters <span className="font-normal text-gray-400">(comma-separated)</span></label>
                                                <input
                                                    type="text"
                                                    value={prompt.starters}
                                                    onChange={(e) => updateWritingPrompt(index, "starters", e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white text-sm"
                                                    placeholder="I remember when…, At my last job…"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Vocabulary hints <span className="font-normal text-gray-400">(comma-separated)</span></label>
                                                <input
                                                    type="text"
                                                    value={prompt.vocab}
                                                    onChange={(e) => updateWritingPrompt(index, "vocab", e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white text-sm"
                                                    placeholder="pressure, deadline, collaborate"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {writingPrompts.length < 3 && (
                                    <button type="button" onClick={addWritingPrompt} className="w-full px-4 py-2 border border-dashed border-gray-300 dark:border-white/20 text-sm text-gray-500 dark:text-gray-400 rounded-md hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                                        + Add Another Prompt (round {writingPrompts.length + 1})
                                    </button>
                                )}
                                {/* Timer + word count settings */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timer Duration (per round)</label>
                                        <select
                                            value={writingTimerSeconds}
                                            onChange={(e) => setWritingTimerSeconds(Number(e.target.value))}
                                            className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                        >
                                            <option value={180}>3 minutes</option>
                                            <option value={300}>5 minutes</option>
                                            <option value={600}>10 minutes</option>
                                            <option value={900}>15 minutes</option>
                                            <option value={1200}>20 minutes</option>
                                            <option value={1800}>30 minutes</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input type="checkbox" id="showWordCount" checked={writingShowWordCount} onChange={(e) => setWritingShowWordCount(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                                        <label htmlFor="showWordCount" className="text-sm text-gray-700 dark:text-gray-300">Show word count to students</label>
                                    </div>
                                </div>
                            </div>
                        ) : (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Content Format
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="contentType"
                                        value="simple"
                                        checked={contentType === "simple"}
                                        onChange={(e) => setContentType(e.target.value)}
                                        className="mr-2"
                                    />
                                    Simple Text
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="contentType"
                                        value="quiz"
                                        checked={contentType === "quiz"}
                                        onChange={(e) => setContentType(e.target.value)}
                                        className="mr-2"
                                    />
                                    Quiz Questions
                                </label>
                            </div>
                        </div>
                        )}

                        {type !== "writing" && (contentType === "quiz" ? (
                            <div className="space-y-4">
                                {quizQuestions.map((question, index) => (
                                    <div key={question.id} className="border border-gray-200 dark:border-white/10 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-gray-900 dark:text-white">Question {index + 1}</h4>
                                            {quizQuestions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuizQuestion(index)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Question
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.question}
                                                    onChange={(e) => updateQuizQuestion(index, "question", e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                                    placeholder="Enter question…"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Question Type
                                                </label>
                                                <select
                                                    value={question.type}
                                                    onChange={(e) => {
                                                        const newType = e.target.value as QuizQuestionType;
                                                        updateQuizQuestion(index, "type", newType);
                                                        if (newType === "multiple" || newType === "single") {
                                                            updateQuizQuestion(index, "options", ["", "", "", ""]);
                                                        } else {
                                                            updateQuizQuestion(index, "options", []);
                                                        }
                                                    }}
                                                    className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                                >
                                                    <option value="text">Text Answer</option>
                                                    <option value="single">Single Choice</option>
                                                    <option value="multiple">Multiple Choice</option>
                                                </select>
                                            </div>
                                            {(question.type === "single" || question.type === "multiple") && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Options
                                                    </label>
                                                    {question.options.map((option, optIndex) => (
                                                        <input
                                                            key={optIndex}
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => {
                                                                const newOptions = [...question.options];
                                                                newOptions[optIndex] = e.target.value;
                                                                updateQuizQuestion(index, "options", newOptions);
                                                            }}
                                                            className="w-full mb-2 rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white"
                                                            placeholder={`Option ${optIndex + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addQuizQuestion}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-white/20 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                                >
                                    + Add Question
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={12}
                                    className="w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-white/5 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900 dark:text-white font-mono text-sm"
                                    placeholder="Enter activity content…"
                                    required={contentType === "simple"}
                                />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    You can use markdown-style formatting or plain text.
                                </p>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-gray-300 dark:border-white/20 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? "Creating…" : "Create Activity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}









