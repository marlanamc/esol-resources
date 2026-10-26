"use server";

import { revalidatePath } from "next/cache";

/**
 * Called after a practice log saves (POST /api/study-log). From a Server Function,
 * revalidatePath also clears the browser's Client Cache, so going back to the home
 * page or profile shows the new check mark without a manual refresh. The route
 * handler alone can't: there revalidatePath only marks the server side.
 */
export async function refreshPracticeViews() {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
}
