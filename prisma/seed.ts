import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const firebaseUser = {
    uid: 'HnfgjY6q7AadShNqBPYysFhzZu53',
    email: 'yosuke.kmt@gmail.com',
    emailVerified: true,
    displayName: undefined,
    photoURL: undefined,
    phoneNumber: undefined,
    disabled: false,
    passwordHash: undefined,
    passwordSalt: undefined,
    tenantId: undefined,
  };

  const admin = await prisma.admin.upsert({
    where: { firebaseUserId: firebaseUser.uid },
    update: {
      email: firebaseUser.email,
      firebaseUserId: firebaseUser.uid,
      firebaseUserRaw: firebaseUser,
    },
    create: {
      email: firebaseUser.email,
      firebaseUserId: firebaseUser.uid,
      firebaseUserRaw: firebaseUser,
    },
  });
  console.log(admin);
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
