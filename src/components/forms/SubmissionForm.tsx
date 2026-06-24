"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { submitWithOutbox } from "@/lib/submissionOutbox";

const schema = z.object({
    submissionContent: z.string().min(1, "Please provide your submission"),
});
type FormValues = z.infer<typeof schema>;

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
    const submitButtonRef = useRef<HTMLDivElement>(null);
    const isAlreadySubmitted =
        existingSubmission?.status === "submitted" || existingSubmission?.status === "graded";

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { submissionContent: existingSubmission?.content ?? "" },
    });

    useEffect(() => {
        if (existingSubmission?.content) {
            reset({ submissionContent: existingSubmission.content });
        }
    }, [existingSubmission?.content, reset]);

    const handleTextareaFocus = () => {
        if (window.innerWidth < 768) {
            setTimeout(() => {
                submitButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 300);
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            const submitResult = await submitWithOutbox({
                endpoint: "/api/submissions",
                method: existingSubmission ? "PUT" : "POST",
                payload: {
                    activityId,
                    assignmentId,
                    content: values.submissionContent,
                    submissionId: existingSubmission?.id,
                },
            });

            if (!submitResult.queued) {
                const response = submitResult.response;
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to submit");
                }
                router.refresh();
            }
        } catch (err: unknown) {
            setError("root", {
                message: err instanceof Error ? err.message : "Failed to submit",
            });
        }
    };

    if (existingSubmission?.status === "graded") return null;

    const submitted = isSubmitSuccessful || isAlreadySubmitted;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <textarea
                        {...register("submissionContent")}
                        onFocus={handleTextareaFocus}
                        className="form-field resize-y min-h-[120px] max-h-[40vh] md:min-h-[240px] md:max-h-[400px]"
                        placeholder="Type your answers, responses, or work here…"
                        disabled={existingSubmission?.status === "graded"}
                    />
                    {errors.submissionContent && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.submissionContent.message}</p>
                    )}
                </div>

                {errors.root && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                        <p className="text-sm text-red-800 dark:text-red-200">{errors.root.message}</p>
                    </div>
                )}

                {submitted && existingSubmission?.status === "submitted" && (
                    <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            ✓ Your submission has been submitted. Waiting for teacher review.
                        </p>
                    </div>
                )}

                {(!submitted || existingSubmission?.status === "pending") && (
                    <div ref={submitButtonRef} className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 min-h-[44px] border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting…" : existingSubmission ? "Update Submission" : "Submit"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
