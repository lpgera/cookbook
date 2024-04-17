export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: any; output: any }
}

export type Ingredient = {
  __typename?: 'Ingredient'
  amount: Scalars['String']['output']
  createdAt: Scalars['Date']['output']
  group: IngredientGroup
  groupId: Scalars['Int']['output']
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  order: Scalars['Int']['output']
  unit: Scalars['String']['output']
  updatedAt: Scalars['Date']['output']
}

export type IngredientGroup = {
  __typename?: 'IngredientGroup'
  createdAt: Scalars['Date']['output']
  id: Scalars['Int']['output']
  ingredients: Array<Ingredient>
  name: Scalars['String']['output']
  recipe: Recipe
  recipeId: Scalars['Int']['output']
  updatedAt: Scalars['Date']['output']
}

export type IngredientGroupInput = {
  id?: InputMaybe<Scalars['Int']['input']>
  ingredients: Array<IngredientInput>
  name: Scalars['String']['input']
}

export type IngredientInput = {
  amount: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  name: Scalars['String']['input']
  unit: Scalars['String']['input']
}

export type Mutation = {
  __typename?: 'Mutation'
  addRecipe: Recipe
  deleteRecipe: Recipe
  login: Scalars['String']['output']
  updateRecipe: Recipe
}

export type MutationAddRecipeArgs = {
  recipe: RecipeInput
}

export type MutationDeleteRecipeArgs = {
  id: Scalars['Int']['input']
}

export type MutationLoginArgs = {
  password: Scalars['String']['input']
}

export type MutationUpdateRecipeArgs = {
  id: Scalars['Int']['input']
  recipe: RecipeInput
}

export type Query = {
  __typename?: 'Query'
  categories: Array<Scalars['String']['output']>
  ingredients: Array<Scalars['String']['output']>
  recipe: Recipe
  recipes: Array<Recipe>
  units: Array<Scalars['String']['output']>
}

export type QueryRecipeArgs = {
  id: Scalars['Int']['input']
}

export type QueryRecipesArgs = {
  category?: InputMaybe<Scalars['String']['input']>
}

export type Recipe = {
  __typename?: 'Recipe'
  categories: Array<Scalars['String']['output']>
  createdAt: Scalars['Date']['output']
  description: Scalars['String']['output']
  id: Scalars['Int']['output']
  ingredientGroups: Array<IngredientGroup>
  instructions: Scalars['String']['output']
  name: Scalars['String']['output']
  updatedAt: Scalars['Date']['output']
}

export type RecipeInput = {
  categories: Array<Scalars['String']['input']>
  description: Scalars['String']['input']
  ingredientGroups: Array<IngredientGroupInput>
  instructions: Scalars['String']['input']
  name: Scalars['String']['input']
}
