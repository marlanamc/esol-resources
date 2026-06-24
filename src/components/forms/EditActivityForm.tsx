"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    category: z.string().optional(),
    level: z.string().optional(),
    content: z.string().min(1, "Content is required"),
});
type FormValues = z.infer<typeof schema>;

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    content: string;
}

interface Props {
    activity: Activity;
}

function parseContentForDisplay(rawContent: string): string {
    try {
        const parsed = JSON.parse(rawContent);
        if (parsed.content) return parsed.content;
        return JSON.stringify(parsed, null, 2);
    } catch {
        return rawContent;
    }
}

export default function EditActivityForm({ activity }: Props) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: activity.title,
            description: activity.description ?? "",
            type: activity.type,
            category: activity.category ?? "",
            level: activity.level ?? "",
            content: "",
        },
    });

    useEffect(() => {
        reset({
            title: activity.title,
            description: activity.description ?? "",
            type: activity.type,
            category: activity.category ?? "",
            level: activity.level ?? "",
            content: parseContentForDisplay(activity.content),
        });
    }, [activity, reset]);

    const onSubmit = async (values: FormValues) => {
        let activityContent: string;
        try {
            const parsed = JSON.parse(values.content);
            activityContent = JSON.stringify(parsed);
        } catch {
            activityContent = JSON.stringify({ content: values.content });
        }

        try {
            await apiFetch(`/api/activities/${activity.id}`, {
                method: "PUT",
                body: {
                    title: values.title,
                    description: values.description || null,
                    type: values.type,
                    category: values.category || null,
                    level: values.level || null,
                    content: activityContent,
                },
            });
            router.push("/dashboard/activities");
            router.refresh();
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Failed to update activity",
            });
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--surface-elevated)] shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                {...register("title")}
                                className="form-field mt-1"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                rows={3}
                                className="form-field mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Type *
                                </label>
                                <select id="type" {...register("type")} className="form-field mt-1">
                                    <option value="worksheet">Worksheet</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="slides">Slides</option>
                                    <option value="guide">Guide</option>
                                    <option value="game">Game</option>
                                    <option value="resource">Resource</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select id="category" {...register("category")} className="form-field mt-1">
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
                                <select id="level" {...register("level")} className="form-field mt-1">
                                    <option value="">Select level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content</h3>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                {...register("content")}
                                rows={15}
                                className="form-field font-mono text-sm"
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
                            )}
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Edit the activity content. For JSON-based activities, maintain the JSON structure.
                            </p>
                        </div>
                    </div>

                    {errors.root && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">{errors.root.message}</p>
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
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
