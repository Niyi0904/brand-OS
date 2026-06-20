const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findMany()
  .then(users => {
    console.log('Users in database:', JSON.stringify(users, null, 2));
    if (users.length === 0) {
      console.log('WARNING: No users found in database!');
    }
  })
  .catch(err => console.error('Database error:', err.message))
  .finally(() => prisma.$disconnect());