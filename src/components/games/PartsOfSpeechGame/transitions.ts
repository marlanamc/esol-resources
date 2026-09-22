/**
 * The one screen-change transition for the Parts of Speech game.
 *
 * Opacity only, and short. Screen changes used to stack several animations --
 * the phase wrapper rising from y:20 over 0.4s, a 0.4s exit before it through
 * a blank frame, the header dropping in, the play area sliding in from the
 * right, and every intro/results section fading in on its own delay -- which
 * read as the whole game flashing between screens. One quiet crossfade per
 * change, with nothing moving, is all a learner needs to see that the screen
 * changed.
 */
export const SCREEN_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15, ease: 'easeOut' },
} as const;
