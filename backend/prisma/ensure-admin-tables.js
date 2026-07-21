import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS public."Garage" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS public."Mechanic" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL UNIQUE,
      "garageId" TEXT,
      "certificationUrl" TEXT,
      "isVerified" BOOLEAN NOT NULL DEFAULT false,
      "verifiedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Mechanic_userId_fkey'
      ) THEN
        ALTER TABLE public."Mechanic"
        ADD CONSTRAINT "Mechanic_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES public."User"("id")
        ON UPDATE CASCADE ON DELETE RESTRICT;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Mechanic_garageId_fkey'
      ) THEN
        ALTER TABLE public."Mechanic"
        ADD CONSTRAINT "Mechanic_garageId_fkey"
        FOREIGN KEY ("garageId") REFERENCES public."Garage"("id")
        ON UPDATE CASCADE ON DELETE SET NULL;
      END IF;
    END $$;
  `);

  console.log('AutoDoc Garage and Mechanic tables are ready.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
