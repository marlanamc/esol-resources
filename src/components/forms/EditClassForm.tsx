"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription || "");
    const [sectionSourceClassId, setSectionSourceClassId] = useState(initialSourceClassId || "");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isInSectionGroup = Boolean(initialSectionGroupId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(`/api/classes/${classId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description: description || null,
                    sectionSourceClassId: sectionSourceClassId || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update class");
            }

            router.push(`/dashboard/classes/${classId}`);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update class");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[var(--surface-elevated)] shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Class Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-field mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            autoComplete="off"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-field mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="sectionSourceClassId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Section Group
                        </label>
                        <select
                            id="sectionSourceClassId"
                            value={sectionSourceClassId}
                            onChange={(e) => setSectionSourceClassId(e.target.value)}
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

                    {error && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
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
                            disabled={isLoading}
                            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

