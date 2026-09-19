import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACTIVITY_ID = 'action-or-description';
const TITLE = 'Action or Description?';
const DESCRIPTION =
  'Sort each word: does it need a verb, or does it need am / is / are? Then see the finished sentence.';

/**
 * Plain-text sorting content. Format per line:
 *   word :: Category - explanation :: finished sentence
 * `*...*` marks the verb or BE form in the sentence so the learner can see what
 * the sort was really about. A `NOTE:` line becomes a banner for that round.
 *
 * Cards are deliberately base-form / bare ("work", not "works at the hospital") —
 * a conjugated card hands the learner the answer through the -s.
 *
 * Rounds 1-5 use only clean cases. Round 6 teaches the exception: the commonest
 * state verbs (know, want, have, like, need) are states but still take a verb,
 * never BE. The buckets are really "needs a verb" vs "needs BE", so these belong
 * in Action.
 */
const gameContent = `[ROUND 1]
work :: Action - Something you DO. Use the verb by itself. :: She *works* at the hospital.
eat :: Action - Something you DO. Use the verb by itself. :: We *eat* dinner at six.
sleep :: Action - Something you DO. Use the verb by itself. :: He *sleeps* eight hours.
walk :: Action - Something you DO. Use the verb by itself. :: They *walk* to school.
read :: Action - Something you DO. Use the verb by itself. :: I *read* every night.
tired :: Description - A feeling, not an action. Use am / is / are. :: I *am* tired.
happy :: Description - A feeling, not an action. Use am / is / are. :: She *is* happy.
cold :: Description - How something feels. Use am / is / are. :: The room *is* cold.
hungry :: Description - A feeling, not an action. Use am / is / are. :: The children *are* hungry.
tall :: Description - How someone looks. Use am / is / are. :: My brother *is* tall.

[ROUND 2]
study :: Action - Something you DO. Use the verb by itself. :: He *studies* English on Mondays.
drive :: Action - Something you DO. Use the verb by itself. :: She *drives* to work.
cook :: Action - Something you DO. Use the verb by itself. :: I *cook* dinner every night.
run :: Action - Something you DO. Use the verb by itself. :: They *run* in the park.
write :: Action - Something you DO. Use the verb by itself. :: We *write* in our notebooks.
busy :: Description - This describes a person. Use am / is / are. :: My teacher *is* busy today.
sick :: Description - This describes a person. Use am / is / are. :: He *is* sick today.
ready :: Description - This describes a person. Use am / is / are. :: We *are* ready for the test.
late :: Description - This describes a thing. Use am / is / are. :: The bus *is* late.
nervous :: Description - A feeling, not an action. Use am / is / are. :: I *am* nervous before a test.

[ROUND 3]
clean :: Action - Something you DO. Use the verb by itself. :: She *cleans* the kitchen on Saturday.
wash :: Action - Something you DO. Use the verb by itself. :: He *washes* the dishes after dinner.
help :: Action - Something you DO. Use the verb by itself. :: They *help* their neighbors.
listen :: Action - Something you DO. Use the verb by itself. :: We *listen* to the radio.
watch :: Action - Something you DO. Use the verb by itself. :: I *watch* the news at night.
a nurse :: Description - A job is a noun, not an action. Use am / is / are. :: She *is* a nurse.
a student :: Description - A job is a noun, not an action. Use am / is / are. :: I *am* a student.
my brother :: Description - This says WHO someone is. Use am / is / are. :: Carlos *is* my brother.
from Guatemala :: Description - This says WHERE someone is from. Use am / is / are. :: They *are* from Guatemala.
25 years old :: Description - Age uses BE in English, not have. Say "is 25 years old", never "has 25 years". :: My son *is* 25 years old.

[ROUND 4]
teach :: Action - Something you DO. Use the verb by itself. :: She *teaches* math.
wait :: Action - Something you DO. Use the verb by itself. :: We *wait* for the bus.
call :: Action - Something you DO. Use the verb by itself. :: He *calls* his mother on Sundays.
pay :: Action - Something you DO. Use the verb by itself. :: I *pay* the rent on the first.
open :: Action - Something you DO. Use the verb by itself. :: The store *opens* at nine.
afraid :: Description - A feeling, not an action. Use am / is / are. :: I *am* afraid of dogs.
proud :: Description - A feeling, not an action. Use am / is / are. :: She *is* proud of her son.
angry :: Description - A feeling, not an action. Use am / is / are. :: He *is* angry about the bill.
surprised :: Description - It ends in -ed, but it is a feeling, not an action. Use am / is / are. :: We *are* surprised by the news.
worried :: Description - It ends in -ed, but it is a feeling, not an action. Use am / is / are. :: My mother *is* worried about me.

[ROUND 5]
practice :: Action - Something you DO. Use the verb by itself. :: I *practice* English every day.
exercise :: Action - Something you DO. Use the verb by itself. :: They *exercise* in the morning.
travel :: Action - Something you DO. Use the verb by itself. :: We *travel* in the summer.
shop :: Action - Something you DO. Use the verb by itself. :: She *shops* on Saturdays.
arrive :: Action - Something you DO. Use the verb by itself. :: The train *arrives* at eight.
married :: Description - This describes a person, not an action. Use am / is / are. :: My sister *is* married.
single :: Description - This describes a person, not an action. Use am / is / are. :: He *is* single.
at home :: Description - This says WHERE someone is. Use am / is / are. :: The kids *are* at home.
in class :: Description - This says WHERE someone is. Use am / is / are. :: We *are* in class right now.
on time :: Description - This describes a person, not an action. Use am / is / are. :: The teacher *is* always on time.

[ROUND 6]
NOTE: Challenge Round
know :: Action - "Know" happens in your head, but it is still a verb. Never BE. Wrong: I am know her. Right: I know her. :: I *know* her name.
want :: Action - "Want" is a feeling, but it is still a verb. Never BE. Wrong: She is want a job. Right: She wants a job. :: She *wants* a new job.
have :: Action - "Have" is a state, but it is still a verb. Never BE. Wrong: We are have two children. Right: We have two children. :: We *have* two children.
like :: Action - "Like" is a feeling, but it is still a verb. Never BE. Wrong: They are like the teacher. Right: They like the teacher. :: They *like* the new teacher.
need :: Action - "Need" is a feeling, but it is still a verb. Never BE. Wrong: He is need more time. Right: He needs more time. :: He *needs* more time.
understand :: Action - "Understand" happens in your head, but it is still a verb. Never BE. :: I *understand* the question.
remember :: Action - "Remember" happens in your head, but it is still a verb. Never BE. :: She *remembers* my birthday.
hungry :: Description - Careful! In English you ARE hungry. You do not "have hunger". :: I *am* hungry.
thirsty :: Description - Careful! In English you ARE thirsty. You do not "have thirst". :: The baby *is* thirsty.
sure :: Description - A feeling, not an action. Use am / is / are. :: We *are* sure about the answer.
`;

async function main() {
  console.log('🚀 Importing "Action or Description?" sorting game...\n');

  const teacher = await prisma.user.findFirst({
    where: { role: { in: ['admin', 'teacher'] } },
  });
  if (!teacher) {
    console.error('❌ No teacher account found. Please create a teacher account first.');
    process.exit(1);
  }
  console.log(`✓ Found teacher: ${teacher.name ?? teacher.username}\n`);

  const activity = await prisma.activity.upsert({
    where: { id: ACTIVITY_ID },
    update: {
      title: TITLE,
      description: DESCRIPTION,
      type: 'game',
      category: 'games',
      ui: 'matching',
      level: 'beginner',
      content: gameContent,
      isReleased: true,
    },
    create: {
      id: ACTIVITY_ID,
      title: TITLE,
      description: DESCRIPTION,
      type: 'game',
      category: 'games',
      ui: 'matching',
      level: 'beginner',
      content: gameContent,
      isReleased: true,
      createdBy: teacher.id,
    },
  });

  const roundCount = (gameContent.match(/\[ROUND\s*\d+\]/g) || []).length;
  const cardCount = gameContent
    .split('\n')
    .filter((line) => line.includes('::')).length;

  console.log(`✅ Seeded "${TITLE}" (${activity.id})`);
  console.log(`   ${roundCount} rounds, ${cardCount} cards`);
  console.log(`   → /activity/${ACTIVITY_ID}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
