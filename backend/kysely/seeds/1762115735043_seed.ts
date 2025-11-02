import kysely from '../db.ts'

export async function seed(db: typeof kysely): Promise<void> {
  const now = new Date()

  await db.transaction().execute(async (trx) => {
    const recipe = await trx
      .insertInto('Recipe')
      .values({
        updatedAt: now,
        name: 'Scrambled eggs',
        description: 'An easy breakfast',
        instructions:
          'Beat the eggs. Place them in a bowl and whisk them until thoroughly combined.\n' +
          'Brush a pan with a little olive oil and warm over medium heat.\n' +
          'Pour the eggs into the pan and let it cook for a few seconds. Stir every few seconds.\n' +
          'Stop when the eggs are mostly set and remove the pan from the heat.\n' +
          'Season with salt and pepper.',
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    const ingredientGroup = await trx
      .insertInto('IngredientGroup')
      .values({
        updatedAt: now,
        recipeId: recipe.id,
        name: '',
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    await trx
      .insertInto('Ingredient')
      .values([
        {
          groupId: ingredientGroup.id,
          updatedAt: now,
          name: 'eggs',
          amount: '6',
          unit: 'pieces',
          order: 1,
        },
        {
          groupId: ingredientGroup.id,
          updatedAt: now,
          name: 'olive oil',
          amount: 'a few',
          unit: 'drops',
          order: 2,
        },
        {
          groupId: ingredientGroup.id,
          updatedAt: now,
          name: 'salt',
          amount: '1',
          unit: 'pinch',
          order: 3,
        },
        {
          groupId: ingredientGroup.id,
          updatedAt: now,
          name: 'pepper',
          amount: '1',
          unit: 'pinch',
          order: 4,
        },
      ])
      .execute()

    const categories = await trx
      .insertInto('Category')
      .values([
        {
          updatedAt: now,
          name: 'Breakfast',
        },
        {
          updatedAt: now,
          name: 'Eggs',
        },
      ])
      .returningAll()
      .execute()

    await trx
      .insertInto('_CategoryToRecipe')
      .values(
        categories.map((category) => ({
          A: category.id,
          B: recipe.id,
        }))
      )
      .execute()
  })
}
