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
  id: Scalars['Int']
  name: Scalars['String']
  order: Scalars['Int']
  recipe: Recipe
  recipeId: Scalars['Int']
  updatedAt: Scalars['Date']
}

export type IngredientInput = {
  amount: Scalars['String']
  name: Scalars['String']
}

export enum IngredientMoveDirection {
  Down = 'DOWN',
  Up = 'UP',
}

export type Mutation = {
  __typename?: 'Mutation'
  addIngredient: Ingredient
  addRecipe: Recipe
  deleteIngredient: Ingredient
  deleteRecipe: Recipe
  moveIngredient: Ingredient
  updateIngredient: Ingredient
  updateRecipe: Recipe
}

export type MutationAddIngredientArgs = {
  ingredient: IngredientInput
  recipeId: Scalars['Int']
}

export type MutationAddRecipeArgs = {
  recipe: RecipeInput
}

export type MutationDeleteIngredientArgs = {
  id: Scalars['Int']
}

export type MutationDeleteRecipeArgs = {
  id: Scalars['Int']
}

export type MutationMoveIngredientArgs = {
  direction: IngredientMoveDirection
  id: Scalars['Int']
}

export type MutationUpdateIngredientArgs = {
  id: Scalars['Int']
  ingredient: IngredientInput
}

export type MutationUpdateRecipeArgs = {
  id: Scalars['Int']
  recipe: RecipeInput
}

export type Query = {
  __typename?: 'Query'
  recipe: Recipe
  recipes: Array<Recipe>
}

export type QueryRecipeArgs = {
  id: Scalars['Int']
}

export type Recipe = {
  __typename?: 'Recipe'
  createdAt: Scalars['Date']
  description?: Maybe<Scalars['String']>
  id: Scalars['Int']
  ingredients: Array<Ingredient>
  instructions?: Maybe<Scalars['String']>
  name: Scalars['String']
  updatedAt: Scalars['Date']
}

export type RecipeInput = {
  description?: InputMaybe<Scalars['String']>
  instructions?: InputMaybe<Scalars['String']>
  name: Scalars['String']
}
