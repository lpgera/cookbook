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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

export type Ingredient = {
  __typename?: 'Ingredient'
  amount: Scalars['String']
  createdAt: Scalars['Date']
  group: IngredientGroup
  groupId: Scalars['Int']
  id: Scalars['Int']
  name: Scalars['String']
  order: Scalars['Int']
  unit: Scalars['String']
  updatedAt: Scalars['Date']
}

export type IngredientGroup = {
  __typename?: 'IngredientGroup'
  createdAt: Scalars['Date']
  id: Scalars['Int']
  ingredients: Array<Ingredient>
  name: Scalars['String']
  recipe: Recipe
  recipeId: Scalars['Int']
  updatedAt: Scalars['Date']
}

export type IngredientGroupInput = {
  id?: InputMaybe<Scalars['Int']>
  ingredients: Array<IngredientInput>
  name: Scalars['String']
}

export type IngredientInput = {
  amount: Scalars['String']
  id?: InputMaybe<Scalars['Int']>
  name: Scalars['String']
  unit: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  addRecipe: Recipe
  deleteRecipe: Recipe
  login: Scalars['String']
  updateRecipe: Recipe
}

export type MutationAddRecipeArgs = {
  recipe: RecipeInput
}

export type MutationDeleteRecipeArgs = {
  id: Scalars['Int']
}

export type MutationLoginArgs = {
  password: Scalars['String']
}

export type MutationUpdateRecipeArgs = {
  id: Scalars['Int']
  recipe: RecipeInput
}

export type Query = {
  __typename?: 'Query'
  ingredients: Array<Scalars['String']>
  recipe: Recipe
  recipes: Array<Recipe>
  units: Array<Scalars['String']>
}

export type QueryRecipeArgs = {
  id: Scalars['Int']
}

export type Recipe = {
  __typename?: 'Recipe'
  createdAt: Scalars['Date']
  description: Scalars['String']
  id: Scalars['Int']
  ingredientGroups: Array<IngredientGroup>
  instructions: Scalars['String']
  name: Scalars['String']
  updatedAt: Scalars['Date']
}

export type RecipeInput = {
  description: Scalars['String']
  ingredientGroups: Array<IngredientGroupInput>
  instructions: Scalars['String']
  name: Scalars['String']
}
