import { RELEASED_RESCUE_COLLECTIONS } from './release';
import { getVisibleMap } from '@/lib/course-map';
import { RESCUE_COLLECTIONS } from './content';

/** Use the same class reveals/schedules and independent-learner policy as the course map. */
export async function getRescueCollectionsForUser(user: { id: string; role?: string | null }) {
  if (user.role === 'teacher' || user.role === 'admin') return RESCUE_COLLECTIONS;
  const { units } = await getVisibleMap(user);
  const activityIds = new Set(units.flatMap(unit => unit.levels.flatMap(level =>
    [...level.requiredActivities, ...(level.extraPractice ?? [])].map(item => item.activityId))));
  return RESCUE_COLLECTIONS.filter(set => RELEASED_RESCUE_COLLECTIONS.has(set.id) && (!set.sourceActivityId || activityIds.has(set.sourceActivityId))); 
}
