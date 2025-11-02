import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('Recipe')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('createdAt', 'timestamp(3)', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updatedAt', 'timestamp(3)', (col) => col.notNull())
    .addColumn('name', 'varchar(511)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('instructions', 'text')
    .execute()

  await db.schema
    .createTable('IngredientGroup')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('createdAt', 'timestamp(3)', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updatedAt', 'timestamp(3)', (col) => col.notNull())
    .addColumn('recipeId', 'integer', (col) =>
      col.notNull().references('Recipe.id').onDelete('cascade')
    )
    .addColumn('name', 'varchar(511)')
    .execute()

  await db.schema
    .createTable('Ingredient')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('createdAt', 'timestamp(3)', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updatedAt', 'timestamp(3)', (col) => col.notNull())
    .addColumn('groupId', 'integer', (col) =>
      col.notNull().references('IngredientGroup.id').onDelete('cascade')
    )
    .addColumn('name', 'varchar(511)', (col) => col.notNull())
    .addColumn('amount', 'varchar(511)', (col) => col.notNull())
    .addColumn('unit', 'varchar(511)', (col) => col.notNull())
    .addColumn('order', 'integer', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('Ingredient_name_idx')
    .on('Ingredient')
    .column('name')
    .execute()

  await db.schema
    .createIndex('Ingredient_unit_idx')
    .on('Ingredient')
    .column('unit')
    .execute()

  await db.schema
    .createTable('Category')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('createdAt', 'timestamp(3)', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updatedAt', 'timestamp(3)', (col) => col.notNull())
    .addColumn('name', 'varchar(511)', (col) => col.notNull().unique())
    .execute()

  await db.schema
    .createTable('_CategoryToRecipe')
    .addColumn('A', 'integer', (col) => col.notNull().references('Category.id'))
    .addColumn('B', 'integer', (col) => col.notNull().references('Recipe.id'))
    .execute()

  await db.schema
    .createIndex('_CategoryToRecipe_AB_unique')
    .on('_CategoryToRecipe')
    .columns(['A', 'B'])
    .unique()
    .execute()

  await db.schema
    .createIndex('_CategoryToRecipe_B_index')
    .on('_CategoryToRecipe')
    .column('B')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('_CategoryToRecipe_B_index').execute()
  await db.schema.dropIndex('_CategoryToRecipe_AB_unique').execute()
  await db.schema.dropTable('_CategoryToRecipe').execute()
  await db.schema.dropTable('Category').execute()
  await db.schema.dropIndex('Ingredient_unit_idx').execute()
  await db.schema.dropIndex('Ingredient_name_idx').execute()
  await db.schema.dropTable('Ingredient').execute()
  await db.schema.dropTable('IngredientGroup').execute()
  await db.schema.dropTable('Recipe').execute()
}
