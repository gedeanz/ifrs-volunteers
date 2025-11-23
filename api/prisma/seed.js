const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedVolunteers() {
  const volunteersCount = await prisma.volunteer.count();
  if (volunteersCount > 0) {
    console.log('Voluntários já existentes. Seed de voluntários ignorado.');
    return;
  }

  const password = '123456';
  const hashedPassword = await bcrypt.hash(password, 10);

  const volunteers = [
    { name: 'Administrador', email: 'admin@ifrs.edu', phone: '(54) 99999-0001', role: 'admin' },
    { name: 'João Pedro', email: 'user@ifrs.edu', phone: '(54) 99999-0002', role: 'user' },
    { name: 'Maria Franz', email: 'maria@ifrs.edu', phone: '(54) 99999-0003', role: 'user' },
    { name: 'Pedro Machado', email: 'pedro@ifrs.edu', phone: '(54) 99999-0004', role: 'user' },
  ];

  for (const volunteer of volunteers) {
    await prisma.volunteer.create({
      data: {
        ...volunteer,
        password: hashedPassword,
      },
    });
    console.log(`Criado: ${volunteer.email} / ${password} (${volunteer.role})`);
  }
}

async function seedEvents() {
  const eventsCount = await prisma.event.count();
  if (eventsCount > 0) {
    console.log('Eventos já existentes. Seed de eventos ignorado.');
    return;
  }

  await prisma.event.createMany({
    data: [
      {
        title: 'Doação de Sangue',
        description: 'Campanha no Hospital Tacchinni',
        eventDate: new Date('2025-10-13T09:00:00'),
        location: 'Hospital Tacchinni',
        capacity: 80,
      },
      {
        title: 'Mutirão Ambiental',
        description: 'Limpeza das principais praças da cidade',
        eventDate: new Date('2025-10-15T08:00:00'),
        location: 'Praça Centenário',
        capacity: 50,
      },
      {
        title: 'Arrecadação de Alimentos',
        description: 'Coleta no campus do IFRS-BG',
        eventDate: new Date('2025-10-19T10:00:00'),
        location: 'Campus IFRS-BG',
        capacity: 100,
      },
    ],
  });

  console.log('Eventos cadastrados com sucesso.');
}

async function main() {
  await seedVolunteers();
  await seedEvents();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\nSeed concluído.');
  })
  .catch(async (err) => {
    console.error('Erro ao executar seed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
