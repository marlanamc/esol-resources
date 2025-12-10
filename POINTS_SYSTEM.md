# Points & Gamification System

## Current Points System

### How Students Earn Points

#### 1. **Activity Completion** (+1 point)
- Awarded when a student completes ANY activity for the first time
- Includes: flashcards, fill-in-the-blank, matching games, grammar guides
- Only awarded once per activity (no points for re-doing)

#### 2. **Quiz Completion** (+10 points base)
- Base points for completing any quiz
- **Perfect Score Bonus**: +20 points (100% correct)
- **High Score Bonuses**:
  - 90-99%: +10 points
  - 80-89%: +5 points

**Example Quiz Scoring:**
- 100% correct: 10 (base) + 20 (perfect) + 10 (90%+) = **40 points**
- 92% correct: 10 (base) + 10 (90%+) = **20 points**
- 85% correct: 10 (base) + 5 (80%+) = **15 points**
- 75% correct: 10 (base) = **10 points**

#### 3. **Daily Streak** (+5 points per day)
- Earned when student completes an activity on consecutive days
- Resets if they miss a day
- Encourages daily practice

#### 4. **Weekly Streak Bonus** (+25 points)
- Earned every 7 days of consecutive activity
- Rewards long-term commitment

#### 5. **Achievements** (varies)
- Special bonuses for milestones
- Currently configured in the system but not actively displayed

---

## Current Leaderboard System

### Weekly Leaderboard
- **Week runs Tuesday - Monday** (to match class schedule)
- Resets every Tuesday (currently manual - run `node scripts/reset-weekly-points.js`)
- Shows top students by weekly points
- Tracks rank changes from previous week
- Students with tied scores receive the same rank

### Exclusions
- Test account "marlie" is excluded from leaderboard
- Students with 0 points don't appear on leaderboard

---

## 💡 Ideas for Improvement

### 1. **More Granular Activity Points**
**Current Problem**: All activities give same points (1 point), whether it's a quick flashcard or a complex grammar guide.

**Suggested Improvement**:
```
- Flashcards: 2 points
- Matching Game: 3 points
- Fill-in-the-Blank: 5 points
- Grammar Guide (complete): 10 points
- Interactive exercises within guides: 2 points each
```

**Pros**: Rewards effort appropriately, encourages tackling harder content
**Cons**: Need to categorize all activities, may need rebalancing

---

### 2. **Progress-Based Points**
**Current Problem**: Only get points for 100% completion, nothing for partial progress.

**Suggested Improvement**:
- Award points for reaching milestones: 25%, 50%, 75%, 100%
- Example: Grammar guide gives 2 points at each checkpoint (8 points total)

**Pros**: Encourages starting longer activities, rewards progress
**Cons**: Could make gaming the system easier

---

### 3. **Accuracy Multipliers**
**Current Problem**: Fill-in-blank gives same points whether you get 5/10 or 10/10.

**Suggested Improvement**:
- Base points × accuracy percentage
- Example: Fill-in-blank worth 10 points
  - 100% correct: 10 points
  - 80% correct: 8 points
  - 50% correct: 5 points

**Pros**: Rewards quality over just completion
**Cons**: May discourage struggling students

---

### 4. **Time-Based Bonuses**
**Suggested Improvement**:
- "Early Bird" bonus: +5 points for completing assignments before due date
- "Speedy" bonus: +3 points for completing within first 24 hours of assignment

**Pros**: Encourages timeliness
**Cons**: May pressure students with busy schedules

---

### 5. **Class Challenges**
**Suggested Improvement**:
- Weekly class goal: "Everyone complete 3 activities this week"
- If class succeeds: Everyone gets +10 bonus points
- Builds teamwork and community

**Pros**: Encourages collaboration, helps struggling students
**Cons**: Could create peer pressure

---

### 6. **Combo/Streak Bonuses**
**Suggested Improvement**:
- Complete 3 activities in one day: +5 bonus
- Complete 5 activities in a row without errors: +10 bonus
- "Perfect Week": Complete all assignments perfectly: +50 bonus

**Pros**: Makes it more game-like and exciting
**Cons**: Could encourage rushing through content

---

### 7. **Skill Badges/Categories**
**Suggested Improvement**:
- Separate leaderboards for different skills:
  - Vocabulary Master
  - Grammar Guru
  - Consistency Champion (streaks)
- Awards different badges/titles

**Pros**: Students can excel in different areas
**Cons**: More complex to implement and display

---

### 8. **Peer Review Points**
**Suggested Improvement**:
- Students can help review each other's written work
- Earn points for providing helpful feedback
- 3 points per review given

**Pros**: Builds community, improves learning
**Cons**: Requires moderation, more complex feature

---

### 9. **Point Decay/Freshness**
**Suggested Improvement**:
- Points from activities over 30 days old slowly decrease
- Encourages continuous engagement
- Example: 100 points earned → after 30 days worth 90 points

**Pros**: Keeps leaderboard dynamic and current
**Cons**: May feel unfair to students who started late

---

### 10. **Study Group Bonuses**
**Suggested Improvement**:
- If 3+ students complete same activity on same day: Everyone gets +2 bonus
- "Study buddy" system for pairs

**Pros**: Encourages social learning
**Cons**: Could exclude isolated students

---

## 🎯 Recommended Quick Wins

These could be implemented relatively easily:

### **Option A: Tiered Activity Points** (Easy)
```javascript
const ACTIVITY_POINTS = {
  flashcards: 2,
  matching: 3,
  'fill-blank': 5,
  guide: 10,
  quiz: 10 // base
};
```

### **Option B: Early Completion Bonus** (Medium)
- Award +5 points if assignment completed 24+ hours before due date
- Simple date comparison

### **Option C: Perfect Week Bonus** (Easy)
- Check if student completed all featured assignments
- Award +25 bonus on Sunday

### **Option D: Better Streak Visualization** (Easy - UI only)
- Show streak counter on dashboard
- "🔥 5 day streak!"
- Motivates continued participation

---

## 📊 Current Issues to Consider

1. **No automatic weekly reset**: Leaderboard doesn't reset automatically (would need cron job or Vercel scheduled function)

2. **Single leaderboard view**: Can't filter by class, timeframe (day/week/month), or skill area

3. **Limited achievement system**: Achievements exist in code but aren't prominently displayed to students

4. **No negative consequences**: Students can't lose points, which reduces stakes

---

## 🔮 Advanced Ideas (Future)

### **Seasonal Competitions**
- Monthly themes: "Vocabulary November"
- Special bonus points for themed activities
- Winner gets featured on dashboard

### **Power-Ups**
- Earn "help tokens" that let you see hints
- "Double points" day once per week
- Makes it more game-like

### **Class vs. Class**
- If you teach multiple classes
- Classes compete for highest average points
- Builds class identity and pride

### **Parent/Student Dashboard**
- Students can share progress with family
- Extra motivation factor

---

## Questions for You

Before implementing changes, consider:

1. **What behavior do you want to encourage most?**
   - Daily practice?
   - Perfect scores?
   - Trying difficult content?
   - Helping peers?

2. **How competitive should it be?**
   - Individual competition?
   - Collaborative goals?
   - Both?

3. **What do students respond to?**
   - Public recognition?
   - Personal bests?
   - Class goals?

4. **Time investment?**
   - Quick wins (tiered points)?
   - Or bigger features (badges, challenges)?

---

## Implementation Priority

### High Priority / Easy Wins
1. ✅ Fix leaderboard ties (DONE)
2. 🎯 Tiered activity points
3. 🎯 Better streak visualization on dashboard
4. 🎯 Early completion bonus for assignments

### Medium Priority
5. Automatic weekly leaderboard reset
6. Multiple leaderboard views (day/week/month)
7. Achievement badges display
8. Perfect week bonus

### Low Priority / Complex
9. Peer review system
10. Class challenges
11. Skill-based leaderboards
12. Point decay

---

## Let's Discuss!

**What excites your students most right now?**
- Competition with each other?
- Personal progress tracking?
- Recognition/achievements?

**What would motivate them more?**
- More points for harder activities?
- Team goals?
- Special challenges?

**What's your priority?**
- Encouraging daily practice?
- Improving accuracy/quality?
- Building classroom community?

Let me know what sounds good and we can start implementing! 🚀
