const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'password123';
const studentNames = [
    'Ricardo',
    'Andrea',
    'Carolina',
    'Ingrid',
    'Elena',
    'Ever',
    'Carlos M',
    'Edwar',
    'Alexandra',
    'Sonia',
    'Erica',
    'Carlos O',
    'Julian',
    'Esteban',
    'Esmeralda',
    'Susan',
    'Will',
    'Marlie',
];

const toUsername = (name) => name.trim().toLowerCase().replace(/\s+/g, '');

async function upsertUser(username, name, role = 'student', mustChangePassword = true) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    return prisma.user.upsert({
        where: { username },
        update: {
            name,
            password: passwordHash,
            role,
            mustChangePassword,
        },
        create: {
            username,
            name,
            password: passwordHash,
            role,
            mustChangePassword,
        },
    });
}

async function main() {
    // Create teacher (with mustChangePassword = true)
    const teacher = await upsertUser('teacher', 'Teacher User', 'teacher', true);

    // Create all students
    const students = [];
    for (const name of studentNames) {
        const username = toUsername(name);
        const student = await upsertUser(username, name, 'student');
        students.push(student);
    }

    // Create ESOL 3 class
    const esol3Class = await prisma.class.upsert({
        where: { code: 'ESOL3' },
        update: {},
        create: {
            name: 'ESOL 3',
            description: 'ESOL Level 3 - Your Class',
            code: 'ESOL3',
            teacherId: teacher.id,
        },
    });

    // Enroll all students in ESOL 3
    for (const student of students) {
        await prisma.classEnrollment.upsert({
            where: {
                classId_studentId: {
                    classId: esol3Class.id,
                    studentId: student.id,
                },
            },
            update: {},
            create: {
                classId: esol3Class.id,
                studentId: student.id,
            },
        });
    }

    // Create Present Perfect Complete Guide
    const presentPerfectGuide = await prisma.activity.upsert({
        where: { id: 'present-perfect-guide' },
        update: {
            title: 'Present Perfect - Complete Step-by-Step Guide',
            description: 'Complete guide to Present Perfect tense with numbered sections for easy navigation. Includes meaning, past participles, forms (positive, negative, questions), and time expressions (for/since, already/yet/just, ever/never) with interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/present-perfect'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'present-perfect-guide',
            title: 'Present Perfect - Complete Step-by-Step Guide',
            description: 'Complete guide to Present Perfect tense with numbered sections for easy navigation. Includes meaning, past participles, forms (positive, negative, questions), and time expressions (for/since, already/yet/just, ever/never) with interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/present-perfect'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Present Simple Complete Guide
    const presentSimpleGuide = await prisma.activity.upsert({
        where: { id: 'present-simple-guide' },
        update: {
            title: 'Present Simple - Complete Step-by-Step Guide',
            description: 'Complete guide to Present Simple tense with numbered sections for easy navigation. Includes meaning and usage, forms (positive, negative, questions), spelling rules for -s/es endings, and time expressions with interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/present-simple'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'present-simple-guide',
            title: 'Present Simple - Complete Step-by-Step Guide',
            description: 'Complete guide to Present Simple tense with numbered sections for easy navigation. Includes meaning and usage, forms (positive, negative, questions), spelling rules for -s/es endings, and time expressions with interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/present-simple'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Past Simple Complete Guide
    const pastSimpleGuide = await prisma.activity.upsert({
        where: { id: 'past-simple-guide' },
        update: {
            title: 'Past Simple - Complete Step-by-Step Guide',
            description: 'Complete guide to Past Simple tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/past-simple'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'past-simple-guide',
            title: 'Past Simple - Complete Step-by-Step Guide',
            description: 'Complete guide to Past Simple tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/past-simple'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Future Simple Complete Guide
    const futureSimpleGuide = await prisma.activity.upsert({
        where: { id: 'future-simple-guide' },
        update: {
            title: 'Future Simple - Complete Step-by-Step Guide',
            description: 'Complete guide to Future Simple tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/future-simple'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'future-simple-guide',
            title: 'Future Simple - Complete Step-by-Step Guide',
            description: 'Complete guide to Future Simple tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/future-simple'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Present Continuous Complete Guide
    const presentContinuousGuide = await prisma.activity.upsert({
        where: { id: 'present-continuous-guide' },
        update: {
            title: 'Present Continuous - Complete Step-by-Step Guide',
            description: 'Complete guide to Present Continuous tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/present-continuous'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'present-continuous-guide',
            title: 'Present Continuous - Complete Step-by-Step Guide',
            description: 'Complete guide to Present Continuous tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/present-continuous'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Past Continuous Complete Guide
    const pastContinuousGuide = await prisma.activity.upsert({
        where: { id: 'past-continuous-guide' },
        update: {
            title: 'Past Continuous - Complete Step-by-Step Guide',
            description: 'Complete guide to Past Continuous tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/past-continuous'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'past-continuous-guide',
            title: 'Past Continuous - Complete Step-by-Step Guide',
            description: 'Complete guide to Past Continuous tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/past-continuous'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Future Continuous Complete Guide
    const futureContinuousGuide = await prisma.activity.upsert({
        where: { id: 'future-continuous-guide' },
        update: {
            title: 'Future Continuous - Complete Step-by-Step Guide',
            description: 'Complete guide to Future Continuous tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/future-continuous'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'future-continuous-guide',
            title: 'Future Continuous - Complete Step-by-Step Guide',
            description: 'Complete guide to Future Continuous tense with numbered sections for easy navigation. Includes meaning, forms, and interactive exercises.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/future-continuous'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Simple Tenses Review Guide
    const simpleTensesReviewGuide = await prisma.activity.upsert({
        where: { id: 'simple-tenses-review-guide' },
        update: {
            title: 'Simple Tenses Review - Complete Guide',
            description: 'Compare and practice Present Simple, Past Simple, and Future Simple together.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/simple-tenses-review'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'simple-tenses-review-guide',
            title: 'Simple Tenses Review - Complete Guide',
            description: 'Compare and practice Present Simple, Past Simple, and Future Simple together.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/simple-tenses-review'
            }),
            createdBy: teacher.id,
        },
    });

    // Create Continuous Tenses Review Guide
    const continuousTensesReviewGuide = await prisma.activity.upsert({
        where: { id: 'continuous-tenses-review-guide' },
        update: {
            title: 'Continuous Tenses Review - Complete Guide',
            description: 'Compare and practice Present Continuous, Past Continuous, and Future Continuous together.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/continuous-tenses-review'
            }),
            createdBy: teacher.id,
        },
        create: {
            id: 'continuous-tenses-review-guide',
            title: 'Continuous Tenses Review - Complete Guide',
            description: 'Compare and practice Present Continuous, Past Continuous, and Future Continuous together.',
            type: 'guide',
            category: 'grammar',
            level: 'intermediate',
            content: JSON.stringify({
                externalUrl: '/grammar-reader/continuous-tenses-review'
            }),
            createdBy: teacher.id,
        },
    });

    // Update Vocab September Flashcards
    const vocabSeptemberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-september-flashcards' },
        update: {
            title: 'Unit 1: Flash Cards',
            description: 'Vocabulary flashcards for September unit - Personal Daily Life',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Your life experiences and history — **background**
Q: The process of signing up for school or services — **registration**
Q: Education, training, or skills that prepare a person for a specific job or trade — **vocational**
Q: The reason or drive behind someone's actions or goals — **motivation**
Q: The process of change from one situation to another — **transition**
Q: The act of coming to a new country to live permanently — **immigration**
Q: Dedication to a task, goal, or promise — **commitment**
Q: Something that blocks or makes it difficult to move forward — **barrier**
Q: A chance to do something or achieve success — **opportunity**
Q: Proof of training or education — **qualification**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-september-flashcards',
            title: 'Unit 1: Flash Cards',
            description: 'Vocabulary flashcards for September unit - Personal Daily Life',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Your life experiences and history — **background**
Q: The process of signing up for school or services — **registration**
Q: Education, training, or skills that prepare a person for a specific job or trade — **vocational**
Q: The reason or drive behind someone's actions or goals — **motivation**
Q: The process of change from one situation to another — **transition**
Q: The act of coming to a new country to live permanently — **immigration**
Q: Dedication to a task, goal, or promise — **commitment**
Q: Something that blocks or makes it difficult to move forward — **barrier**
Q: A chance to do something or achieve success — **opportunity**
Q: Proof of training or education — **qualification**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab September Flashcards updated:', vocabSeptemberFlashcards.title);

    // October Flashcards
    const vocabOctoberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-october-flashcards' },
        update: {
            title: 'Unit 2: Flash Cards',
            description: 'Vocabulary flashcards for October unit - Daily Life in the Community',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Friendly and likes to meet people — **outgoing**
Q: A problem that gets in the way of your goal — **obstacle**
Q: Something that makes it hard to focus — **distraction**
Q: Someone you can trust — **reliable**
Q: To review or check again — **go over**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-october-flashcards',
            title: 'Unit 2: Flash Cards',
            description: 'Vocabulary flashcards for October unit - Daily Life in the Community',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Friendly and likes to meet people — **outgoing**
Q: A problem that gets in the way of your goal — **obstacle**
Q: Something that makes it hard to focus — **distraction**
Q: Someone you can trust — **reliable**
Q: To review or check again — **go over**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab October Flashcards updated:', vocabOctoberFlashcards.title);

    // November Flashcards
    const vocabNovemberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-november-flashcards' },
        update: {
            title: 'Unit 3: Flash Cards',
            description: 'Vocabulary flashcards for November unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Small tasks outside the home, like shopping or mailing letters — **errands**
Q: To move to a new place — **relocate**
Q: A section on a website you can click — **tab**
Q: Not required to pay — **waived**
Q: Classes or programs to help you learn work skills — **job training**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-november-flashcards',
            title: 'Unit 3: Flash Cards',
            description: 'Vocabulary flashcards for November unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Small tasks outside the home, like shopping or mailing letters — **errands**
Q: To move to a new place — **relocate**
Q: A section on a website you can click — **tab**
Q: Not required to pay — **waived**
Q: Classes or programs to help you learn work skills — **job training**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab November Flashcards updated:', vocabNovemberFlashcards.title);

    // December Flashcards
    const vocabDecemberFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-december-flashcards' },
        update: {
            title: 'Unit 4: Flash Cards',
            description: 'Vocabulary flashcards for December unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Money returned after you return a product — **refund**
Q: A trick to steal money or cheat someone — **scam**
Q: Special parts or qualities of a product — **features**
Q: Small payments made over time — **installments**
Q: A written promise to fix or replace a product — **warranty**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-december-flashcards',
            title: 'Unit 4: Flash Cards',
            description: 'Vocabulary flashcards for December unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Money returned after you return a product — **refund**
Q: A trick to steal money or cheat someone — **scam**
Q: Special parts or qualities of a product — **features**
Q: Small payments made over time — **installments**
Q: A written promise to fix or replace a product — **warranty**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab December Flashcards updated:', vocabDecemberFlashcards.title);

    // January Flashcards
    const vocabJanuaryFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-january-flashcards' },
        update: {
            title: 'Unit 5: Flash Cards',
            description: 'Vocabulary flashcards for January unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Money paid in advance to protect against damage — **deposit**
Q: A legal contract for renting property — **lease**
Q: Someone who rents a home or apartment — **tenant**
Q: Empty or available for rent — **vacant**
Q: Basic services in a home (electricity, water, gas) — **utilities**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-january-flashcards',
            title: 'Unit 5: Flash Cards',
            description: 'Vocabulary flashcards for January unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Money paid in advance to protect against damage — **deposit**
Q: A legal contract for renting property — **lease**
Q: Someone who rents a home or apartment — **tenant**
Q: Empty or available for rent — **vacant**
Q: Basic services in a home (electricity, water, gas) — **utilities**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab January Flashcards updated:', vocabJanuaryFlashcards.title);

    // February Flashcards
    const vocabFebruaryFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-february-flashcards' },
        update: {
            title: 'Unit 6: Flash Cards',
            description: 'Vocabulary flashcards for February unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Able to speak a language easily and well — **fluent**
Q: Careful and focused on small things — **detail-oriented**
Q: Belief in yourself — **self-confidence**
Q: Things you like more than others — **preferences**
Q: Happening quickly — **fast-paced**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-february-flashcards',
            title: 'Unit 6: Flash Cards',
            description: 'Vocabulary flashcards for February unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Able to speak a language easily and well — **fluent**
Q: Careful and focused on small things — **detail-oriented**
Q: Belief in yourself — **self-confidence**
Q: Things you like more than others — **preferences**
Q: Happening quickly — **fast-paced**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab February Flashcards updated:', vocabFebruaryFlashcards.title);

    // March Flashcards
    const vocabMarchFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-march-flashcards' },
        update: {
            title: 'Unit 7: Flash Cards',
            description: 'Vocabulary flashcards for March unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: The total money you earn before taxes or deductions — **gross pay**
Q: Wanting to be successful or achieve goals — **ambitious**
Q: Polite and respectful behavior — **courtesy**
Q: To find and bring new people into a company or group — **recruit**
Q: To accept a new responsibility or job — **take on**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-march-flashcards',
            title: 'Unit 7: Flash Cards',
            description: 'Vocabulary flashcards for March unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: The total money you earn before taxes or deductions — **gross pay**
Q: Wanting to be successful or achieve goals — **ambitious**
Q: Polite and respectful behavior — **courtesy**
Q: To find and bring new people into a company or group — **recruit**
Q: To accept a new responsibility or job — **take on**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab March Flashcards updated:', vocabMarchFlashcards.title);

    // April Flashcards
    const vocabAprilFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-april-flashcards' },
        update: {
            title: 'Unit 8: Flash Cards',
            description: 'Vocabulary flashcards for April unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: A doctor for the heart — **cardiologist**
Q: Feeling very sad or unhappy — **depressed**
Q: Organs that filter waste from your blood — **kidneys**
Q: Swollen, red, or painful — **inflamed**
Q: Pain or swelling in the joints — **arthritis**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-april-flashcards',
            title: 'Unit 8: Flash Cards',
            description: 'Vocabulary flashcards for April unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: A doctor for the heart — **cardiologist**
Q: Feeling very sad or unhappy — **depressed**
Q: Organs that filter waste from your blood — **kidneys**
Q: Swollen, red, or painful — **inflamed**
Q: Pain or swelling in the joints — **arthritis**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab April Flashcards updated:', vocabAprilFlashcards.title);

    // May Flashcards
    const vocabMayFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-may-flashcards' },
        update: {
            title: 'Unit 9: Flash Cards',
            description: 'Vocabulary flashcards for May unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Overall health and happiness — **well-being**
Q: Not being able to stop doing or using something harmful — **addiction**
Q: Having enough water in your body — **hydration**
Q: Extreme tiredness caused by too much work or stress — **burnout**
Q: A routine plan, often for health or fitness — **regimen**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-may-flashcards',
            title: 'Unit 9: Flash Cards',
            description: 'Vocabulary flashcards for May unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Overall health and happiness — **well-being**
Q: Not being able to stop doing or using something harmful — **addiction**
Q: Having enough water in your body — **hydration**
Q: Extreme tiredness caused by too much work or stress — **burnout**
Q: A routine plan, often for health or fitness — **regimen**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab May Flashcards updated:', vocabMayFlashcards.title);

    // June Flashcards
    const vocabJuneFlashcards = await prisma.activity.upsert({
        where: { id: 'vocab-june-flashcards' },
        update: {
            title: 'Unit 10: Flash Cards',
            description: 'Vocabulary flashcards for June unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Meeting people to share information and opportunities — **networking**
Q: Improving yourself over time — **personal growth**
Q: Choosing the best action from different options — **decision-making**
Q: Learning to grow in your career — **professional development**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-june-flashcards',
            title: 'Unit 10: Flash Cards',
            description: 'Vocabulary flashcards for June unit',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: Meeting people to share information and opportunities — **networking**
Q: Improving yourself over time — **personal growth**
Q: Choosing the best action from different options — **decision-making**
Q: Learning to grow in your career — **professional development**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab June Flashcards updated:', vocabJuneFlashcards.title);

    console.log('✅ Seeded database with teacher, ESOL 3 class, students, and grammar guides');
    console.log('👥 Students added:', students.length);
    console.log('📚 Present Perfect guide added:', presentPerfectGuide.title);
    console.log('📚 Present Simple guide added:', presentSimpleGuide.title);
    console.log('📚 Past Simple guide added:', pastSimpleGuide.title);
    console.log('📚 Future Simple guide added:', futureSimpleGuide.title);
    console.log('📚 Present Continuous guide added:', presentContinuousGuide.title);
    console.log('📚 Past Continuous guide added:', pastContinuousGuide.title);
    console.log('📚 Future Continuous guide added:', futureContinuousGuide.title);
    console.log('📚 Simple Tenses Review guide added:', simpleTensesReviewGuide.title);
    console.log('📚 Continuous Tenses Review guide added:', continuousTensesReviewGuide.title);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
