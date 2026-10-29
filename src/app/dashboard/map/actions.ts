"use server";

import { revalidatePath } from "next/cache";

/**
 * Called after a learner taps "Thanks!" on a question answer. From a Server Function, revalidatePath
 * also clears the browser's Client Cache, so going back to Home drops the "Your teacher answered" line.
 */
export async function refreshQuestionAnswerViews() {
    revalidatePath("/dashboard");
}
