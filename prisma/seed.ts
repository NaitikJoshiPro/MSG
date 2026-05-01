import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedAnannya = await bcrypt.hash('An@nnya0204', 12)
  const hashedNaitik = await bcrypt.hash('Naitik@2024', 12)

  const anannya = await prisma.user.upsert({
    where: { email: 'anannya@msg.com' },
    update: {},
    create: {
      email: 'anannya@msg.com',
      name: 'Anannya',
      password: hashedAnannya,
    },
  })

  const naitik = await prisma.user.upsert({
    where: { email: 'naitik@msg.com' },
    update: {},
    create: {
      email: 'naitik@msg.com',
      name: 'Naitik',
      password: hashedNaitik,
    },
  })

  // Check if conversation already exists between them
  const existing = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          userId: { in: [anannya.id, naitik.id] },
        },
      },
      AND: {
        participants: {
          some: { userId: anannya.id },
        },
      },
    },
    include: { participants: true },
  })

  if (!existing) {
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: anannya.id },
            { userId: naitik.id },
          ],
        },
      },
    })
    console.log('Created conversation:', conversation.id)
  }

  console.log('Seed complete')
  console.log('Anannya:', anannya.email, '/ An@nnya0204')
  console.log('Naitik:', naitik.email, '/ Naitik@2024')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
