import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  await prisma.recipe.create({
    data: {
      name: 'Scrambled eggs',
      description: 'An easy breakfast',
      instructions:
        'Beat the eggs. Place them in a bowl and whisk them until thoroughly combined.\n' +
        'Brush a pan with a little olive oil and warm over medium heat.\n' +
        'Pour the eggs into the pan and let it cook for a few seconds. Stir every few seconds.\n' +
        'Stop when the eggs are mostly set and remove the pan from the heat.\n' +
        'Season with salt and pepper.',
      ingredientGroups: {
        create: [
          {
            name: '',
            ingredients: {
              create: [
                {
                  name: 'eggs',
                  amount: '6',
                  unit: 'pieces',
                  order: 1,
                },
                {
                  name: 'olive oil',
                  amount: 'a few',
                  unit: 'drops',
                  order: 2,
                },
                {
                  name: 'salt',
                  amount: '1',
                  unit: 'pinch',
                  order: 3,
                },
                {
                  name: 'pepper',
                  amount: '1',
                  unit: 'pinch',
                  order: 4,
                },
              ],
            },
          },
        ],
      },
    },
  })
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
