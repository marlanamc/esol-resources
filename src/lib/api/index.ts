// API domain barrel exports

// Response helpers
export {
  apiSuccess,
  apiError,
  handleValidationError,
  handleApiError,
  withErrorHandling,
  isApiError,
  isApiSuccess,
  ApiErrors,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "./response";

// Request validation schemas
export {
  parseApiBody,
  ActivitySubmitBodySchema,
  SubmissionsPostBodySchema,
  ClassesPostBodySchema,
  JoinClassBodySchema,
  AssignmentPatchBodySchema,
  FeedbackPostBodySchema,
  CalendarEventPostBodySchema,
  CalendarEventPatchBodySchema,
  AssignmentPostBodySchema,
  type ActivitySubmitBody,
  type SubmissionsPostBody,
  type ClassesPostBody,
  type JoinClassBody,
  type AssignmentPatchBody,
  type FeedbackPostBody,
  type CalendarEventPostBody,
  type CalendarEventPatchBody,
  type AssignmentPostBody,
} from "./schemas";

// Rate limiting
export {
  checkRateLimit,
  getClientIp,
  authRateLimitKey,
  type RateLimitOptions,
} from "./rate-limit";

// Request logging
export {
  logApiRequest,
  withRequestLogging,
  type RequestLogContext,
} from "./request-logging";
