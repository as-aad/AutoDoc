import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const garagesToSeed = [
    { name: 'Downtown Auto', address: '123 Main Street, Downtown', phone: '+1-555-0100' },
    { name: 'Westside Garage', address: '456 West Ave, Westside', phone: '+1-555-0200' },
    { name: 'North Auto Works', address: '789 North Blvd, Northside', phone: '+1-555-0300' },
  ];

  for (const g of garagesToSeed) {
    const existing = await prisma.garage.findFirst({ where: { name: g.name } });
    if (!existing) {
      await prisma.garage.create({ data: g });
      console.log('Created garage:', g.name);
    } else {
      console.log('Garage already exists:', g.name);
    }
  }

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: { name: 'Demo Customer' },
    create: { email: 'customer@example.com', name: 'Demo Customer', role: 'CUSTOMER' },
  });
  console.log('Seeded customer:', customer.email);

  const vehicle = await prisma.vehicle.upsert({
    where: { id: 'VEH_TEST_1' },
    update: {},
    create: {
      id: 'VEH_TEST_1',
      ownerId: customer.id,
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      licensePlate: 'DEMO-123',
      mileage: 50000,
    },
  });
  console.log('Seeded vehicle:', vehicle.id);

  const existingRequest = await prisma.serviceRequest.findFirst({
    where: { description: 'Brake pads making squealing noise' },
  });
  if (!existingRequest) {
    await prisma.serviceRequest.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        description: 'Brake pads making squealing noise, need inspection and replacement',
        photoUrl: 'https://via.placeholder.com/400x300?text=Brake+Issue',
        status: 'OPEN',
      },
    });
    console.log('Created demo service request');
  }

  const mechanics = [
    {
      email: 'ali@example.com',
      name: 'Ali',
      certificationUrl: 'https://example.com/certs/ali-cert.pdf',
    },
    {
      email: 'sara@example.com',
      name: 'Sara',
      certificationUrl: 'https://example.com/certs/sara-cert.pdf',
    },
  ];

  for (const m of mechanics) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: { name: m.name },
      create: { email: m.email, name: m.name },
    });

    const existing = await prisma.mechanic.findUnique({ where: { userId: user.id } });
    if (!existing) {
      await prisma.mechanic.create({
        data: {
          userId: user.id,
          certificationUrl: m.certificationUrl,
          isVerified: false,
        },
      });
      console.log('Created pending mechanic:', m.name);
    } else {
      console.log('Mechanic already exists:', m.name);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
