const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    try {
        const newPassword = 'password123';
        const passwordHash = await bcrypt.hash(newPassword, 10);

        const user = await prisma.user.update({
            where: { username: 'marlie' },
            data: {
                password: passwordHash,
                mustChangePassword: true
            }
        });

        console.log('✅ Password reset successfully!');
        console.log('Username: marlie');
        console.log('Password: password123');
        console.log('User will be prompted to change password on next login');
    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
