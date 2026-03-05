"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [sourceClassId, setSourceClassId] = useState(initialSourceClassId);
    const [copyAssignments, setCopyAssignments] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCode(result);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    code: code || undefined,
                    sourceClassId: sourceClassId || undefined,
                    copyAssignments: sourceClassId ? copyAssignments : undefined,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create class");
            }

            const data = await response.json();
            router.push(`/dashboard/classes/${data.id}`);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create class");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Class Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="sourceClassId" className="block text-sm font-medium text-gray-700">
                            Create As Section Of
                        </label>
                        <select
                            id="sourceClassId"
                            value={sourceClassId}
                            onChange={(e) => setSourceClassId(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                        >
                            <option value="">Standalone class (no section sync)</option>
                            {existingClasses.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500">
                            Pick a class to create another section that syncs future activities.
                        </p>
                    </div>

                    {sourceClassId && (
                        <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                            <label className="flex items-start gap-2 text-sm text-blue-900">
                                <input
                                    type="checkbox"
                                    className="mt-0.5"
                                    checked={copyAssignments}
                                    onChange={(e) => setCopyAssignments(e.target.checked)}
                                />
                                Copy existing assignments from the source class now.
                            </label>
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            autoComplete="off"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Class Code
                        </label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="Leave empty to auto-generate"
                                maxLength={10}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                            />
                            <button
                                type="button"
                                onClick={generateCode}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Generate
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Students will use this code to join your class
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? "Creating…" : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}








