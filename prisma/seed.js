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
    // Create teacher
    const teacher = await upsertUser('teacher', 'Teacher User', 'teacher', false);

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
            content: `Q: The reason or drive behind someone's actions or goals — **motivation**
Q: Proof of training or education — **qualification**
Q: The process of change from one situation to another — **transition**
Q: Dedication to a task, goal, or promise — **commitment**
Q: Something that blocks or makes it difficult to move forward — **barrier**`,
            createdBy: teacher.id,
        },
        create: {
            id: 'vocab-september-flashcards',
            title: 'Unit 1: Flash Cards',
            description: 'Vocabulary flashcards for September unit - Personal Daily Life',
            type: 'game',
            category: 'Flash Cards',
            level: 'intermediate',
            content: `Q: The reason or drive behind someone's actions or goals — **motivation**
Q: Proof of training or education — **qualification**
Q: The process of change from one situation to another — **transition**
Q: Dedication to a task, goal, or promise — **commitment**
Q: Something that blocks or makes it difficult to move forward — **barrier**`,
            createdBy: teacher.id,
        },
    });
    console.log('📚 Vocab September Flashcards updated:', vocabSeptemberFlashcards.title);

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
