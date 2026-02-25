const fs = require('fs');
const path = require('path');

// Read the quizzes.json to get the correct mapping
const quizzesPath = path.join(__dirname, '..', 'ESOL_LMS', 'quizzes.json');
const quizzesData = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));

// Build quiz number to data mapping
const quizMap = {};
const weekEntries = Object.entries(quizzesData);
weekEntries.forEach(([weekName, weekData], index) => {
  const quizNumber = index + 1;
  quizMap[quizNumber] = {
    dueDate: weekData.due_date,
    verbs: Object.keys(weekData.verbs)
  };
});

// Format date as "Month Day" (e.g., "March 10")
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// Week to quiz mapping (week 23 should show quiz 9, etc.)
// Week N shows Quiz (N - 14) because Week 16 had Quiz 1, and each class assigns the NEXT week's quiz
// Actually: Week 22 shows Quiz 8, Week 23 shows Quiz 9, etc.
// So: Quiz number = Week number - 14

const classObjectivesDir = path.join(__dirname, '..', 'class_uploads', 'Class-Objectives');

// Process weeks 23-35 (or however many exist)
for (let weekNum = 24; weekNum <= 37; weekNum++) {
  const quizNum = weekNum - 14; // Week 23 -> Quiz 9, Week 24 -> Quiz 10, etc.

  // Find the file
  const files = fs.readdirSync(classObjectivesDir);
  const weekFile = files.find(f => f.startsWith(`week${weekNum}-`) && f.endsWith('-SIMPLIFIED.html'));

  if (!weekFile) {
    console.log(`⏭️  Week ${weekNum} file not found`);
    continue;
  }

  const filePath = path.join(classObjectivesDir, weekFile);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Get the quiz data
  const quiz = quizMap[quizNum];
  if (!quiz) {
    console.log(`⏭️  Quiz ${quizNum} data not found for week ${weekNum}`);
    continue;
  }

  const formattedDate = formatDate(quiz.dueDate);
  const oldQuizNum = quizNum - 1;

  // Update "Take Verb Quiz X"
  content = content.replace(
    new RegExp(`Take Verb Quiz ${oldQuizNum}`, 'g'),
    `Take Verb Quiz ${quizNum}`
  );

  // Update "<strong>Verb Quiz X</strong>"
  content = content.replace(
    new RegExp(`<strong>Verb Quiz ${oldQuizNum}</strong>`, 'g'),
    `<strong>Verb Quiz ${quizNum}</strong>`
  );

  // Update the due date line
  content = content.replace(
    /Due Tuesday, [A-Z][a-z]+ \d+ • Online, 5 verbs/g,
    `Due Tuesday, ${formattedDate} • Online, 5 verbs`
  );

  // Update the verbs in the table
  const verbsHtml = quiz.verbs.map(verb => `                            <tr>
                                <td class="verb-v1">${verb}</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>`).join('\n');

  // Replace the tbody content
  content = content.replace(
    /<tbody>\s*<tr>\s*<td class="verb-v1">[^<]+<\/td>[\s\S]*?<\/tbody>/,
    `<tbody>\n${verbsHtml}\n                            </tbody>`
  );

  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated ${weekFile}: Quiz ${quizNum}, due ${formattedDate}, verbs: ${quiz.verbs.join(', ')}`);
}

console.log('\n✨ Done!');
