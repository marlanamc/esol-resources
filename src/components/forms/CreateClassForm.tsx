"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z.object({
    name: z.string().min(1, "Class name is required").max(200, "Class name too long"),
    description: z.string().optional(),
    code: z.string().max(6, "Code must be 6 characters or fewer").optional(),
    sourceClassId: z.string().optional(),
    copyAssignments: z.boolean().default(true),
});
type FormValues = z.infer<typeof schema>;

interface ExistingClassOption {
    id: string;
    name: string;
}

interface Props {
    existingClasses: ExistingClassOption[];
    initialSourceClassId?: string;
}

export default function CreateClassForm({ existingClasses, initialSourceClassId = "" }: Props) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            code: "",
            sourceClassId: initialSourceClassId,
            copyAssignments: true,
        },
    });

    const sourceClassId = watch("sourceClassId");

    const generateCode = () => {
        const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setValue("code", result);
    };

    const onSubmit = async (values: FormValues) => {
        try {
            const data = await apiFetch<{ id: string }>("/api/classes", {
                method: "POST",
                body: {
                    name: values.name,
                    description: values.description || null,
                    code: values.code || undefined,
                    sourceClassId: values.sourceClassId || undefined,
                    copyAssignments: values.sourceClassId ? values.copyAssignments : undefined,
                },
            });
            router.push(`/dashboard/classes/${data.id}`);
            router.refresh();
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Failed to create class",
            });
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--surface-elevated)] shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Class Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="off"
                            {...register("name")}
                            className="form-field mt-1"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="sourceClassId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Create As Section Of
                        </label>
                        <select
                            id="sourceClassId"
                            {...register("sourceClassId")}
                            className="form-field mt-1"
                        >
                            <option value="">Standalone class (no section sync)</option>
                            {existingClasses.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Pick a class to create another section that syncs future activities.
                        </p>
                    </div>

                    {sourceClassId && (
                        <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/60 p-3">
                            <label className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-200">
                                <input
                                    type="checkbox"
                                    className="mt-0.5"
                                    {...register("copyAssignments")}
                                />
                                Copy existing assignments from the source class now.
                            </label>
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            autoComplete="off"
                            {...register("description")}
                            rows={3}
                            className="form-field mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Class Code
                        </label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="text"
                                id="code"
                                {...register("code", { onChange: (e) => { e.target.value = e.target.value.toUpperCase(); } })}
                                placeholder="Leave empty to auto-generate"
                                maxLength={6}
                                className="form-field"
                            />
                            <button
                                type="button"
                                onClick={generateCode}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-white/20 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                            >
                                Generate
                            </button>
                        </div>
                        {errors.code && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code.message}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Students will use this 6-character code to join your class.
                        </p>
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
                            {isSubmitting ? "Creating…" : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
