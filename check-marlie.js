const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkMarlie() {
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'marlie' }
        });

        if (!user) {
            console.log('❌ User "marlie" not found in database');
            console.log('\nAll users in database:');
            const allUsers = await prisma.user.findMany({
                select: { username: true, name: true }
            });
            console.log(allUsers);
        } else {
            console.log('✅ User found:', {
                username: user.username,
                name: user.name,
                role: user.role,
                mustChangePassword: user.mustChangePassword
            });

            // Test passwords
            const testPasswords = ['password123', 'marlie123', 'Marlie123'];

            console.log('\nTesting passwords:');
            for (const pwd of testPasswords) {
                const isValid = await bcrypt.compare(pwd, user.password);
                console.log(`  "${pwd}": ${isValid ? '✅ MATCHES' : '❌ no match'}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkMarlie();
