export { GET } from "@/lib/activity/progress/get-progress";
export { POST } from "@/lib/activity/progress/post-progress";

export {
    buildProgressGetResponse,
    resolveFinalProgressState,
    sanitizeGuideCompletedSectionIds,
    shouldAwardProgressPoints,
} from "@/lib/activity/progress";
