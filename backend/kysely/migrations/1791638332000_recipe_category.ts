import { type Kysely, sql } from 'kysely'

const tablesWithUpdatedAt = [
  'Recipe',
  'IngredientGroup',
  'Ingredient',
  'Category',
]

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('_CategoryToRecipe')
    .renameTo('RecipeCategory')
    .execute()
  await db.schema
    .alterTable('RecipeCategory')
    .renameColumn('A', 'categoryId')
    .execute()
  await db.schema
    .alterTable('RecipeCategory')
    .renameColumn('B', 'recipeId')
    .execute()

  await db.schema
    .alterTable('RecipeCategory')
    .dropConstraint('_CategoryToRecipe_AB_pkey')
    .ifExists()
    .execute()
  await db.schema.dropIndex('_CategoryToRecipe_AB_unique').ifExists().execute()
  await db.schema.dropIndex('_CategoryToRecipe_B_index').ifExists().execute()

  await db.schema
    .alterTable('RecipeCategory')
    .addPrimaryKeyConstraint('RecipeCategory_pkey', ['recipeId', 'categoryId'])
    .execute()
  await db.schema
    .alterTable('RecipeCategory')
    .addForeignKeyConstraint(
      'RecipeCategory_recipeId_fkey',
      ['recipeId'],
      'Recipe',
      ['id']
    )
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute()
  await db.schema
    .alterTable('RecipeCategory')
    .addForeignKeyConstraint(
      'RecipeCategory_categoryId_fkey',
      ['categoryId'],
      'Category',
      ['id']
    )
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute()
  await db.schema
    .createIndex('RecipeCategory_categoryId_idx')
    .on('RecipeCategory')
    .column('categoryId')
    .execute()

  for (const table of tablesWithUpdatedAt) {
    await db.schema
      .alterTable(table)
      .alterColumn('updatedAt', (col) => col.setDefault(sql`CURRENT_TIMESTAMP`))
      .execute()
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  for (const table of tablesWithUpdatedAt) {
    await db.schema
      .alterTable(table)
      .alterColumn('updatedAt', (col) => col.dropDefault())
      .execute()
  }

  await db.schema.dropIndex('RecipeCategory_categoryId_idx').execute()
  for (const constraint of [
    'RecipeCategory_categoryId_fkey',
    'RecipeCategory_recipeId_fkey',
    'RecipeCategory_pkey',
  ]) {
    await db.schema
      .alterTable('RecipeCategory')
      .dropConstraint(constraint)
      .execute()
  }

  await db.schema
    .alterTable('RecipeCategory')
    .renameColumn('categoryId', 'A')
    .execute()
  await db.schema
    .alterTable('RecipeCategory')
    .renameColumn('recipeId', 'B')
    .execute()
  await db.schema
    .alterTable('RecipeCategory')
    .renameTo('_CategoryToRecipe')
    .execute()

  await db.schema
    .alterTable('_CategoryToRecipe')
    .addPrimaryKeyConstraint('_CategoryToRecipe_AB_pkey', ['A', 'B'])
    .execute()
  await db.schema
    .alterTable('_CategoryToRecipe')
    .addForeignKeyConstraint('_CategoryToRecipe_A_fkey', ['A'], 'Category', [
      'id',
    ])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute()
  await db.schema
    .alterTable('_CategoryToRecipe')
    .addForeignKeyConstraint('_CategoryToRecipe_B_fkey', ['B'], 'Recipe', [
      'id',
    ])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute()
  await db.schema
    .createIndex('_CategoryToRecipe_B_index')
    .on('_CategoryToRecipe')
    .column('B')
    .execute()
}
