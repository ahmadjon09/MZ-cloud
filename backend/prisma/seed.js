/**
 * Enterprise Database Seeder
 * Populates ONLY the Super Admin user account. Zero demo or mock sample files.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Telegram Cloud Storage Platform Database (Real Production Mode)...');

  // Remove any previously generated demo/sample files
  await prisma.fileItem.deleteMany({
    where: {
      OR: [
        { fileId: { startsWith: 'sample_' } },
        { fileId: { startsWith: 'demo_' } },
        { fileId: { startsWith: 'drop_' } }
      ]
    }
  });

  const adminTelegramId = String(process.env.ADMIN_TELEGRAM_ID || '777000');

  // Upsert Super Admin account
  const admin = await prisma.user.upsert({
    where: { telegramId: adminTelegramId },
    update: {
      role: 'SUPER_ADMIN',
      isPremium: true
    },
    create: {
      telegramId: adminTelegramId,
      username: 'superadmin',
      firstName: 'Alisher',
      lastName: 'Navoiy (Admin)',
      language: 'uz',
      profilePhoto: 'https://telegram.org/img/t_logo.png',
      isPremium: true,
      role: 'SUPER_ADMIN',
      storageUsed: 0,
      fileCount: 0
    }
  });

  console.log(`✅ Super Admin account ready: [${admin.firstName}] (ID: ${admin.telegramId})`);
  console.log('🎉 Seeding complete (0 demo files added; clean production database).');
}

main()
  .catch((e) => {
    console.error('❌ Seeder error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
