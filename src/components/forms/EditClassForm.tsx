"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z.object({
    name: z.string().min(1, "Class name is required").max(200, "Class name too long"),
    description: z.string().optional(),
    sectionSourceClassId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface SectionOption {
    id: string;
    name: string;
}

interface Props {
    classId: string;
    initialName: string;
    initialDescription: string | null;
    initialSectionGroupId: string | null;
    sourceOptions: SectionOption[];
    initialSourceClassId: string | null;
}

export default function EditClassForm({
    classId,
    initialName,
    initialDescription,
    initialSectionGroupId,
    sourceOptions,
    initialSourceClassId,
}: Props) {
    const router = useRouter();
    const isInSectionGroup = Boolean(initialSectionGroupId);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialName,
            description: initialDescription ?? "",
            sectionSourceClassId: initialSourceClassId ?? "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await apiFetch(`/api/classes/${classId}`, {
                method: "PATCH",
                body: {
                    name: values.name,
                    description: values.description || null,
                    sectionSourceClassId: values.sectionSourceClassId || null,
                },
            });
            router.push(`/dashboard/classes/${classId}`);
            router.refresh();
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Failed to update class",
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
                            id="name"
                            type="text"
                            autoComplete="off"
                            {...register("name")}
                            className="form-field mt-1"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            autoComplete="off"
                            {...register("description")}
                            className="form-field mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="sectionSourceClassId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Section Group
                        </label>
                        <select
                            id="sectionSourceClassId"
                            {...register("sectionSourceClassId")}
                            className="form-field mt-1"
                        >
                            <option value="">Standalone class (no section sync)</option>
                            {sourceOptions.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {isInSectionGroup
                                ? "Change this if you want to move the class to a different section group."
                                : "Choose a source class to turn this into a synced section."}
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
                            className="rounded-md border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-white/20"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
