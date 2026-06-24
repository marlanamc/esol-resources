"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/client";

const schema = z.object({
    activityId: z.string().min(1, "Please select an activity"),
    title: z.string().optional(),
    instructions: z.string().optional(),
    dueDate: z.string().optional(),
    syncToSectionGroup: z.boolean().default(true),
});
type FormValues = z.infer<typeof schema>;

interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
}

interface Props {
    classId: string;
    activities: Activity[];
    supportsSectionSync?: boolean;
}

export default function CreateAssignmentForm({
    classId,
    activities,
    supportsSectionSync = false,
}: Props) {
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
        defaultValues: { syncToSectionGroup: true },
    });

    const activityId = watch("activityId");
    const selectedActivity = activities.find((a) => a.id === activityId);

    const onSubmit = async (values: FormValues) => {
        try {
            await apiFetch(`/api/assignments`, {
                method: "POST",
                body: {
                    classId,
                    activityId: values.activityId,
                    title: values.title || undefined,
                    instructions: values.instructions || undefined,
                    dueDate: values.dueDate || undefined,
                    syncToSectionGroup: supportsSectionSync ? values.syncToSectionGroup : false,
                },
            });
            router.push(`/dashboard/classes/${classId}`);
            router.refresh();
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Failed to create assignment",
            });
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--surface-elevated)] shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="activityId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Activity *
                        </label>
                        <select
                            id="activityId"
                            {...register("activityId", {
                                onChange: (e) => {
                                    const activity = activities.find((a) => a.id === e.target.value);
                                    if (activity && !watch("title")) {
                                        setValue("title", activity.title);
                                    }
                                },
                            })}
                            className="form-field mt-1"
                        >
                            <option value="">Choose an activity…</option>
                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.title} ({activity.type})
                                    {activity.category && ` - ${activity.category}`}
                                </option>
                            ))}
                        </select>
                        {errors.activityId && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.activityId.message}</p>
                        )}
                        {selectedActivity && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedActivity.description}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register("title")}
                            placeholder="Leave empty to use activity title"
                            className="form-field mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Instructions
                        </label>
                        <textarea
                            id="instructions"
                            {...register("instructions")}
                            rows={4}
                            placeholder="Additional instructions for students…"
                            className="form-field mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Due Date (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            id="dueDate"
                            {...register("dueDate")}
                            className="form-field mt-1"
                        />
                    </div>

                    {supportsSectionSync && (
                        <div className="rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/60 p-3">
                            <label className="flex items-start gap-2 text-sm text-indigo-900 dark:text-indigo-200">
                                <input
                                    type="checkbox"
                                    className="mt-0.5"
                                    {...register("syncToSectionGroup")}
                                />
                                Sync this assignment to all sections in this course.
                            </label>
                        </div>
                    )}

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
                            {isSubmitting ? "Creating…" : "Create Assignment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
