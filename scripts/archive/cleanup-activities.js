const { PrismaClient } = require('@prisma/client');
const { requireSafeDbTarget } = require('../lib/require-safe-db-target');
const prisma = new PrismaClient();

requireSafeDbTarget('cleanup activities');

async function main() {
    console.log('🧹 Cleaning up all activities except Present Perfect guide...');

    // First, get all activity IDs except the Present Perfect guide
    const activitiesToDelete = await prisma.activity.findMany({
        where: {
            NOT: {
                id: 'present-perfect-guide'
            }
        },
        select: { id: true }
    });

    const activityIds = activitiesToDelete.map(a => a.id);

    if (activityIds.length > 0) {
        // Delete submissions for these activities
        const deletedSubmissions = await prisma.submission.deleteMany({
            where: {
                activityId: {
                    in: activityIds
                }
            }
        });
        console.log(`🗑️  Deleted ${deletedSubmissions.count} submissions`);

        // Delete assignments for these activities
        const deletedAssignments = await prisma.assignment.deleteMany({
            where: {
                activityId: {
                    in: activityIds
                }
            }
        });
        console.log(`🗑️  Deleted ${deletedAssignments.count} assignments`);

        // Now delete the activities
        const deleted = await prisma.activity.deleteMany({
            where: {
                id: {
                    in: activityIds
                }
            }
        });

        console.log(`✅ Deleted ${deleted.count} placeholder activities`);
    } else {
        console.log('ℹ️  No activities to delete');
    }

    console.log('✨ Only Present Perfect guide remains in the database');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
