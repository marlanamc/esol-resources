const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        console.log('Checking database for users...\n');
        
        const users = await prisma.user.findMany({
            select: {
                username: true,
                name: true,
                role: true,
                mustChangePassword: true,
                password: true,
            }
        });

        if (users.length === 0) {
            console.log('❌ No users found in database!');
            console.log('\nPlease run: npx prisma db seed\n');
            return;
        }

        console.log(`✅ Found ${users.length} user(s):\n`);
        
        for (const user of users) {
            console.log(`Username: ${user.username}`);
            console.log(`Name: ${user.name}`);
            console.log(`Role: ${user.role}`);
            console.log(`Must change password: ${user.mustChangePassword}`);
            console.log(`Password hash: ${user.password.substring(0, 20)}...`);
            
            // Test password verification
            const testPassword = 'password123';
            const isValid = await bcrypt.compare(testPassword, user.password);
            console.log(`Password '${testPassword}' matches: ${isValid ? '✅' : '❌'}`);
            console.log('---\n');
        }

        // Test login credentials
        console.log('\n📝 Test Login Credentials:');
        console.log('Example student: ricardo / password123');
        console.log('Teacher: teacher / password123');
        
    } catch (error) {
        console.error('❌ Error checking users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();






