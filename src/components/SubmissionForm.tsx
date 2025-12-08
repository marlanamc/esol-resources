"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Submission {
    id: string;
    content: string;
    status: string;
    score: number | null;
    feedback: string | null;
}

interface Props {
    activityId: string;
    assignmentId: string;
    existingSubmission: Submission | null;
}

export default function SubmissionForm({ activityId, assignmentId, existingSubmission }: Props) {
    const router = useRouter();
    const [submissionContent, setSubmissionContent] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (existingSubmission) {
            setSubmissionContent(existingSubmission.content || "");
            setIsSubmitted(existingSubmission.status === "submitted" || existingSubmission.status === "graded");
        }
    }, [existingSubmission]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!submissionContent.trim()) {
            setError("Please provide your submission");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/submissions", {
                method: existingSubmission ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activityId,
                    assignmentId,
                    content: submissionContent,
                    submissionId: existingSubmission?.id,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to submit");
            }

            setIsSubmitted(true);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to submit");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted && existingSubmission?.status === "graded") {
        return null; // Don't show form if already graded
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Your Submission</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="submission" className="block text-sm font-medium text-gray-700 mb-2">
                        {existingSubmission?.status === "submitted" 
                            ? "Update your submission:" 
                            : "Enter your work:"}
                    </label>
                    <textarea
                        id="submission"
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        rows={10}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-gray-900"
                        placeholder="Type your answers, responses, or work here..."
                        disabled={isSubmitted && existingSubmission?.status === "graded"}
                    />
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {isSubmitted && existingSubmission?.status === "submitted" && (
                    <div className="rounded-md bg-blue-50 p-4">
                        <p className="text-sm text-blue-800">
                            ✓ Your submission has been submitted. Waiting for teacher review.
                        </p>
                    </div>
                )}

                {(!isSubmitted || existingSubmission?.status === "pending") && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? "Submitting..." : existingSubmission ? "Update Submission" : "Submit"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}






