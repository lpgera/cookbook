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
  id?: InputMaybe<Scalars['Int']>
  name: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  addRecipe: Recipe
  deleteRecipe: Recipe
  updateRecipe: Recipe
}

export type MutationAddRecipeArgs = {
  recipe: RecipeInput
}

export type MutationDeleteRecipeArgs = {
  id: Scalars['Int']
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
  description: Scalars['String']
  id: Scalars['Int']
  ingredients: Array<Ingredient>
  instructions: Scalars['String']
  name: Scalars['String']
  updatedAt: Scalars['Date']
}

export type RecipeInput = {
  description: Scalars['String']
  ingredients: Array<IngredientInput>
  instructions: Scalars['String']
  name: Scalars['String']
}
