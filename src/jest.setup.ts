import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma/prisma.service';

const JestSetup = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [PrismaService],
  }).compile();

  const prismaService = module.get<PrismaService>(PrismaService);

  console.log('Clearing existing data...');
  await prismaService.result.deleteMany();
  await prismaService.transaction.deleteMany();
  await prismaService.user.deleteMany();
};

export default JestSetup;
