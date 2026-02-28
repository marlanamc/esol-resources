# Irregular Verbs Pattern Game - Testing Guide

## Overview

This document provides comprehensive testing instructions for the Irregular Verbs Pattern Learning Game. The game teaches 76 irregular verbs organized into 10 pattern groups with a sequential unlock system.

## Quick Start

### 1. Database Setup
The test activity has been created in the database:
- **Activity ID**: `irregular-verbs-game`
- **Title**: Irregular Verbs Pattern Game
- **Type**: game / ui: irregular-verbs

### 2. Access the Game
1. Log in as a teacher or student
2. Create/assign the "Irregular Verbs Pattern Game" activity to a class
3. Navigate to the activity as a student
4. You should see the Group Selection screen with Group 1 unlocked

## Test Scenarios

### Test 1: Group Selection & Lock Mechanics
**Objective**: Verify that only Group 1 is unlocked initially and other groups are locked

**Steps**:
1. Load the Group Selection screen
2. Verify Group 1 is clickable (blue, "Start" button visible)
3. Verify Groups 2a-3d show lock icons and are disabled
4. Click on a locked group → should show error toast
5. Verify progress summary shows: 0/10 groups completed, 0% accuracy

**Expected Results**:
- ✅ Only Group 1 is clickable
- ✅ Locked groups show lock overlay
- ✅ Locked groups don't respond to clicks
- ✅ Progress stats display correctly

---

### Test 2: Exercise Types Rotation
**Objective**: Verify all 5 exercise types work correctly in sequence

**Steps**:
1. Click "Start" on Group 1
2. Progress through exercises in order:
   - **Exercise 1**: Fill-in-blank (two input fields)
   - **Exercise 2**: Multiple choice (4 radio options)
   - **Exercise 3**: Sentence completion (inline input)
   - **Exercise 4**: Pattern sorting (4 group buttons)
   - **Exercise 5**: Speed matching (15-second timer)
   - **Exercises 6-10**: Cycle back to types 1-5

**For Each Exercise Type**:

#### Fill-in-blank
- Shows two input fields (past and past participle)
- Has word bank below showing all forms
- Accepts partial matches (e.g., "spent" matches "spent")
- Feedback shows ✅ green for correct, ❌ red for incorrect
- Pressing Enter or clicking Submit advances

#### Multiple Choice
- Shows 4 radio button options
- Only one answer can be selected at a time
- Correct answer highlights in green on submit
- Incorrect answer highlights in red
- Shows correct answer if wrong
- Options disappear after submit

#### Sentence Completion
- Shows sentence with blank (_____)
- Inline input field replaces the blank
- Word bank shows all 3 verb forms below
- Validates in context (e.g., "Yesterday, I _____ the movie" requires past tense)
- Green/red feedback inline

#### Pattern Sorting
- Shows full conjugation: base → past → past participle
- Shows 4 clickable group names (buttons)
- Each click checks if the verb belongs to that group
- Shows checkmark if correct
- Highlights the correct group if wrong
- Example: "cut" (no change group) should be grouped with "cost"

#### Speed Matching
- Shows 15-second countdown timer
- Displays 4 labeled options (A, B, C, D) with verb forms
- Clicking any option instantly checks the answer
- Timer shows: green (>10s) → yellow (5-10s) → red (<5s)
- Auto-advances 1.2s after answer
- Times out and marks as wrong if countdown reaches 0

**Expected Results**:
- ✅ All exercise types render without errors
- ✅ Feedback is immediate and accurate
- ✅ Navigation between exercises is smooth
- ✅ Progress bar advances correctly
- ✅ Enter key works as submit button

---

### Test 3: 80% Unlock Threshold
**Objective**: Verify that 80%+ accuracy unlocks the next group

**Scenario A: Low Accuracy (<80%)**
1. Complete Group 1 with intentionally incorrect answers
2. Target: 70% accuracy (7/10 correct)
3. On results screen:
   - ✅ "Continue to Next Group" button should be DISABLED
   - ✅ Button should show: "Need 80% (you have 70%)"
   - ✅ "Retry Group" button available
4. Click Retry Group
5. Retry and get 80%+ correct

**Scenario B: Passing Accuracy (80%+)**
1. Complete Group 1 with 80%+ accuracy (e.g., 8/10 correct = 80%)
2. On results screen:
   - ✅ "Continue to Next Group" button should be ENABLED
   - ✅ Unlock celebration should show: "🔓 New Group Unlocked! Group 2a"
   - ✅ Next group name should display correctly
3. Click "Continue to Next Group"
4. Verify Group 2a is now playable
5. Go back to Group Selection screen
6. Verify Group 2a is no longer locked
7. Verify Group 2b is still locked (requires Group 2a completion first)

**Expected Results**:
- ✅ <80% accuracy blocks progression
- ✅ ≥80% accuracy unlocks next group
- ✅ Unlock animation plays
- ✅ Next group is immediately playable
- ✅ Groups beyond next group stay locked

---

### Test 4: Progression Chain (Group 1 → 10)
**Objective**: Verify sequential unlock chain works across all 10 groups

**Steps**:
1. Complete Group 1 at 80%+
2. Group 2a should unlock
3. Complete Group 2a at 80%+
4. Group 2b should unlock
5. Complete all groups in sequence:
   - Group 1 → Group 2a
   - Group 2a → Group 2b
   - Group 2b → Group 2c
   - Group 2c → Group 2d
   - Group 2d → Group 2e
   - Group 2e → Group 3a
   - Group 3a → Group 3b
   - Group 3b → Group 3c
   - Group 3c → Group 3d
   - Group 3d → Back to selection (no more groups)

**Expected Results**:
- ✅ Each group unlocks the next one
- ✅ Can't skip groups
- ✅ Final group shows "Back to Group Selection" instead of next group
- ✅ Group Selection shows all groups completed after Group 3d

---

### Test 5: Pattern Hints Toggle
**Objective**: Verify pattern explanation visibility can be toggled

**Steps**:

#### With Hints Shown (default):
1. Start an exercise
2. Pattern Hint should show above the exercise
3. Contains:
   - Group title (e.g., "Form Doesn't Change")
   - Pattern description (e.g., "All three forms are identical")
   - Example (e.g., "cut → cut → cut")
   - First 6 sample verbs with forms
4. Click the chevron (▼) to collapse
5. Pattern Hint collapses smoothly
6. Click chevron again to expand

#### With Hints Hidden:
1. Go to user preferences/settings (future feature)
2. Toggle "Hide pattern explanations"
3. Restart a game
4. Pattern Hint should NOT appear
5. Exercises should still have contextual tips (e.g., "Think about the pattern")

**Expected Results**:
- ✅ Pattern hints show by default
- ✅ Hints are collapsible/expandable
- ✅ Smooth animations on toggle
- ✅ Setting persists across sessions (after preferences implemented)

---

### Test 6: Results Screen & Stats
**Objective**: Verify results display accurate statistics and feedback

**Steps**:
1. Complete a group round
2. Results screen should show:

#### Celebration Animation
- 🎉 (bouncing) if accuracy ≥80%
- ✅ (static) if accuracy <80%
- Group title below
- Contextual heading:
  - ≥80%: "Group Complete!"
  - <80%: "Great Effort!"

#### Stats Grid (6 cards):
- **Accuracy**: Shows percentage with Target icon
  - Green if ≥80%, Blue if <80%
- **Exercises Completed**: Number with Zap icon
- **Points Earned**: "+X" with Trophy icon
- **Streak** (if ≥3 correct): Number with Zap icon
- **Correct Ratio**: "X/N" with Trophy icon

#### Feedback Message
- Color-coded box with feedback:
  - ≥90%: Green box "Outstanding! You really know these verbs! 🌟"
  - ≥80%: Blue box "Excellent work! You've mastered this pattern! 💪"
  - <80%: Yellow box "Good effort! Review and try again to improve your accuracy. 📚"

#### Unlock Banner (if 80%+)
- Shows: "🔓 New Group Unlocked!"
- Next group name displayed
- Lock icon animates with rotation

#### Action Buttons
- "Retry Group": Always enabled
- "Continue to Next Group": Enabled only if accuracy ≥80%
  - Shows required accuracy if disabled

#### Pro Tips Section
- Collapsible tips about spaced repetition and practice

**Expected Results**:
- ✅ All stats calculate correctly
- ✅ Feedback message matches accuracy range
- ✅ Unlock banner shows for 80%+ accuracy
- ✅ Points calculation is accurate
- ✅ Buttons behave correctly
- ✅ Animations are smooth

---

### Test 7: Points & Gamification
**Objective**: Verify points are calculated and awarded correctly

**Points System**:
- Base: 3 points per exercise
- Accuracy bonus:
  - 100% accuracy: +15 points
  - 90-99% accuracy: +10 points
  - 80-89% accuracy: +5 points
- Group completion: included in above

**Examples**:
- 10 exercises × 3 points = 30 base
- 100% accuracy: 30 + 15 = **45 points**
- 90% accuracy (9/10): 30 + 10 = **40 points**
- 80% accuracy (8/10): 30 + 5 = **35 points**

**Steps**:
1. Complete a group with 100% accuracy (10/10 correct)
2. Results should show: "Points Earned: +45"
3. Complete another group with 90% accuracy (9/10 correct)
4. Results should show: "Points Earned: +40"
5. Check user's total points in dashboard/leaderboard
6. Verify points increase correctly

**Expected Results**:
- ✅ Points awarded match calculation
- ✅ Points appear in results screen
- ✅ User's total points increase in dashboard
- ✅ Points appear in leaderboard (if applicable)
- ✅ Streak is updated if activity completes with points

---

### Test 8: Mobile Responsiveness
**Objective**: Verify the game works on mobile devices and tablets

**Device Tests**:
- iPhone 12 (390×844)
- iPhone 14 Pro (393×852)
- iPad (768×1024)
- Android phone (375×812)

**Test Each Screen**:

#### Group Selection Screen
- Grid: 1 column on mobile, 2 on tablet, 3 on desktop
- Cards are touchable (44×44 minimum)
- Text is readable without zooming
- Progress summary is visible
- Motivational message is readable

#### Exercise Screen
- Exercise card is readable on small screens
- Input fields are large enough to type
- Button text is visible
- Progress bar shows percentage clearly
- Pattern hint is collapsible on mobile

#### Results Screen
- Stats grid is readable (2 columns on mobile)
- Unlock banner is visible
- Buttons are stackable vertically on mobile
- Feedback message wraps correctly
- Tips section doesn't overflow

**Steps**:
1. Open dev tools (F12)
2. Toggle device toolbar
3. Test each screen on each device size
4. Verify touch interactions work
5. Test landscape orientation
6. Test zoom at 150% and 200%

**Expected Results**:
- ✅ No horizontal scrolling needed
- ✅ All text is readable
- ✅ Touch targets are accessible
- ✅ Responsive layout adapts correctly
- ✅ No content cutoff

---

### Test 9: Answer Validation
**Objective**: Verify answer validation handles edge cases

**Test Cases**:

#### Case Sensitivity
- Input "SPENT" for "spent" → ✅ Accept
- Input "Spent" for "spent" → ✅ Accept
- Input "spent" for "spent" → ✅ Accept

#### Whitespace Handling
- Input " spent " (with spaces) → ✅ Accept
- Input "spent " (trailing space) → ✅ Accept
- Input " spent" (leading space) → ✅ Accept

#### Alternate Forms (if applicable)
- Input "was" for "to be" past → ✅ Accept (was/were are both valid)
- Input "were" for "to be" past → ✅ Accept

#### Incorrect Answers
- Input "spended" for "spent" → ❌ Reject
- Input "go" for "went" → ❌ Reject
- Input "" (empty) for any → ❌ Reject

**Expected Results**:
- ✅ Case-insensitive matching
- ✅ Whitespace trimmed
- ✅ Alternate forms accepted where applicable
- ✅ Obviously wrong answers rejected

---

### Test 10: Navigation & Error Handling
**Objective**: Verify smooth navigation and graceful error handling

#### Navigation Flow
1. Group Selection → Select Group 1 → Exercise Screen
2. Mid-exercise → Click "Back" → Returns to Group Selection
3. Results Screen → Click "Retry Group" → Back to Exercise Screen (same group)
4. Results Screen → Click "Continue to Next Group" → Next group exercises start
5. Verify all transitions are smooth with Framer Motion

#### Error Handling
1. **Network Error**: Disable network, try to load progress → Shows error message
2. **Invalid Group**: Manually navigate to locked group → Shows "prerequisite required" error
3. **Session Timeout**: Let session expire during game → Redirect to login

**Expected Results**:
- ✅ Smooth transitions between screens
- ✅ No broken routes
- ✅ Error messages are user-friendly
- ✅ Can recover from errors by retrying

---

## Acceptance Criteria Checklist

- [ ] All 10 group patterns load correctly
- [ ] All 5 exercise types render and function
- [ ] 80% unlock threshold enforces progression
- [ ] Sequential unlock chain works (Group 1 → 10)
- [ ] Pattern hints show/hide correctly
- [ ] Results stats calculate accurately
- [ ] Points awarded correctly
- [ ] Mobile layout is responsive
- [ ] Answer validation handles edge cases
- [ ] Navigation is smooth
- [ ] Error states display gracefully
- [ ] TypeScript compilation succeeds (0 errors)
- [ ] ESLint passes (no new violations)
- [ ] Animations are smooth (60fps)

---

## Known Limitations & Future Enhancements

### Current Limitations
1. Pattern hints preference (hideVerbExplanations) is stored in database but UI toggle not yet implemented in settings
2. Spaced repetition not yet implemented (all groups reset on reload)
3. No audio pronunciation support yet
4. No custom verb groups for teachers yet

### Future Enhancements (Post-MVP)
1. **Preferences UI**: Add toggle in user settings dashboard
2. **Spaced Repetition**: Surface verbs based on forgetting curve
3. **Audio**: Text-to-speech for verb pronunciation
4. **Teacher Customization**: Allow teachers to create custom verb groups
5. **Achievements**: Badges for "Pattern Master" (100% on group)
6. **Practice Mode**: Review without affecting progress
7. **Multilingual**: Translations for non-English speakers
8. **Export**: Download progress report as CSV

---

## Debug Tips

### Enable Debug Logging
Add to IrregularVerbsGame.tsx:
```typescript
console.log('Game state:', state);
console.log('Category data:', state.categoryData);
console.log('Current exercise:', state.exercises[state.currentExerciseIndex]);
```

### Check Progress API
Open Network tab in DevTools and inspect:
- `GET /api/activity/progress?activityId=irregular-verbs-game`
- Response should include categoryData with group progress

### Check Database
Use Prisma Studio:
```bash
npx prisma studio
# Navigate to ActivityProgress table to see saved progress
```

### Reset Progress for Testing
Delete the ActivityProgress record for this activity and user:
```bash
npx prisma db seed  # or manually delete in prisma studio
```

---

## Performance Checklist

- [ ] Page loads in <2 seconds
- [ ] Exercise transitions are smooth (no lag)
- [ ] Animations run at 60fps (no jank)
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] Network requests complete within 500ms
- [ ] No console errors or warnings

---

## Contact & Support

For issues or questions:
1. Check the console for error messages
2. Review the error state displayed to user
3. Check Prisma Studio for data consistency
4. Review the implementation plan in the project README
