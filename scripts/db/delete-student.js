const { PrismaClient } = require('@prisma/client');
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('delete student account');

async function deleteStudent(username) {
    try {
        console.log(`🔍 Looking for user with username: ${username}...\n`);
        
        // Find the user
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
            }
        });

        if (!user) {
            console.log(`❌ User "${username}" not found in database.`);
            return;
        }

        console.log(`✅ Found user: ${user.name} (${user.username}, ${user.role})`);
        console.log(`📋 User ID: ${user.id}\n`);

        // Delete related records first (due to foreign key constraints)
        console.log('🗑️  Deleting related records...\n');

        // Delete points ledger entries
        const pointsLedgerCount = await prisma.pointsLedger.deleteMany({
            where: { userId: user.id }
        });
        console.log(`   Deleted ${pointsLedgerCount.count} points ledger entries`);

        // Delete activity progress
        const activityProgressCount = await prisma.activityProgress.deleteMany({
            where: { userId: user.id }
        });
        console.log(`   Deleted ${activityProgressCount.count} activity progress records`);

        // Delete user achievements
        const achievementsCount = await prisma.userAchievement.deleteMany({
            where: { userId: user.id }
        });
        console.log(`   Deleted ${achievementsCount.count} achievements`);

        // Delete submissions
        const submissionsCount = await prisma.submission.deleteMany({
            where: { userId: user.id }
        });
        console.log(`   Deleted ${submissionsCount.count} submissions`);

        // Delete class enrollments
        const enrollmentsCount = await prisma.classEnrollment.deleteMany({
            where: { studentId: user.id }
        });
        console.log(`   Deleted ${enrollmentsCount.count} class enrollments`);

        // Finally, delete the user
        console.log('\n🗑️  Deleting user...');
        await prisma.user.delete({
            where: { id: user.id }
        });

        console.log(`\n✅ Successfully deleted user "${user.name}" (${user.username})`);
        
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Get username from command line argument
const username = process.argv[2];

if (!username) {
    console.error('❌ Please provide a username to delete.');
    console.log('Usage: node scripts/delete-student.js <username>');
    console.log('Example: node scripts/delete-student.js marlie');
    process.exit(1);
}

deleteStudent(username);

