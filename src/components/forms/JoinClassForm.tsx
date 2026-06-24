"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z.object({
    code: z.string().min(1, "Class code is required").max(6, "Code must be 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function JoinClassForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        try {
            const data = await apiFetch<{ classId: string }>("/api/classes/join", {
                method: "POST",
                body: { code: values.code.toUpperCase().trim() },
            });
            router.push(`/dashboard/classes/${data.classId}`);
            router.refresh();
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Failed to join class",
            });
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--surface-elevated)] shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Enter Class Code</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ask your teacher for the class code to join their class.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Class Code *
                        </label>
                        <input
                            type="text"
                            id="code"
                            {...register("code", { onChange: (e) => { e.target.value = e.target.value.toUpperCase(); } })}
                            placeholder="ABC123"
                            className="form-field mt-1 text-center text-2xl font-mono tracking-wider"
                            maxLength={6}
                        />
                        {errors.code && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code.message}</p>
                        )}
                    </div>

                    {errors.root && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">{errors.root.message}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 border border-gray-300 dark:border-white/20 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? "Joining…" : "Join Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
