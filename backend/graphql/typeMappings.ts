import type { Selectable } from 'kysely'
import type {
  Recipe,
  IngredientGroup,
  Ingredient,
} from '../kysely/db.types.gen.ts'

export type DbRecipe = Selectable<Recipe>
export type DbIngredientGroup = Selectable<IngredientGroup>
export type DbIngredient = Selectable<Ingredient>
