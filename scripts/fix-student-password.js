const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const TARGET_USERNAME = process.env.TARGET_USERNAME || 'ricardo';
const NEW_PASSWORD = 'password123';

async function fixStudentPassword() {
    try {
        console.log('Fixing student password...\n');
        
        const studentPassword = await bcrypt.hash(NEW_PASSWORD, 10);
        
        const student = await prisma.user.update({
            where: { username: TARGET_USERNAME },
            data: {
                password: studentPassword,
            },
        });

        console.log('✅ Student password updated successfully!');
        console.log(`Username: ${student.username}`);
        console.log(`New password hash: ${student.password.substring(0, 30)}...`);
        
        // Verify it works
        const isValid = await bcrypt.compare(NEW_PASSWORD, student.password);
        console.log(`Password verification: ${isValid ? '✅' : '❌'}`);
        
    } catch (error) {
        console.error('❌ Error fixing password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixStudentPassword();






