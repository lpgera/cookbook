import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
import {
  PrismaRecipe,
  PrismaIngredientGroup,
  PrismaIngredient,
} from './typeMappings'
export type Maybe<T> = T extends PromiseLike<infer U>
  ? Promise<U | null>
  : T | null
export type InputMaybe<T> = T extends PromiseLike<infer U>
  ? Promise<U | null>
  : T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
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

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Date: ResolverTypeWrapper<Scalars['Date']>
  Ingredient: ResolverTypeWrapper<PrismaIngredient>
  IngredientGroup: ResolverTypeWrapper<PrismaIngredientGroup>
  IngredientGroupInput: IngredientGroupInput
  IngredientInput: IngredientInput
  Int: ResolverTypeWrapper<Scalars['Int']>
  Mutation: ResolverTypeWrapper<{}>
  Query: ResolverTypeWrapper<{}>
  Recipe: ResolverTypeWrapper<PrismaRecipe>
  RecipeInput: RecipeInput
  String: ResolverTypeWrapper<Scalars['String']>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']
  Date: Scalars['Date']
  Ingredient: PrismaIngredient
  IngredientGroup: PrismaIngredientGroup
  IngredientGroupInput: IngredientGroupInput
  IngredientInput: IngredientInput
  Int: Scalars['Int']
  Mutation: {}
  Query: {}
  Recipe: PrismaRecipe
  RecipeInput: RecipeInput
  String: Scalars['String']
}>

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type IngredientResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']
> = ResolversObject<{
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  group?: Resolver<ResolversTypes['IngredientGroup'], ParentType, ContextType>
  groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type IngredientGroupResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['IngredientGroup'] = ResolversParentTypes['IngredientGroup']
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  ingredients?: Resolver<
    Array<ResolversTypes['Ingredient']>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  recipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType>
  recipeId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  addRecipe?: Resolver<
    ResolversTypes['Recipe'],
    ParentType,
    ContextType,
    RequireFields<MutationAddRecipeArgs, 'recipe'>
  >
  deleteRecipe?: Resolver<
    ResolversTypes['Recipe'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRecipeArgs, 'id'>
  >
  updateRecipe?: Resolver<
    ResolversTypes['Recipe'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateRecipeArgs, 'id' | 'recipe'>
  >
}>

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  ingredients?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  recipe?: Resolver<
    ResolversTypes['Recipe'],
    ParentType,
    ContextType,
    RequireFields<QueryRecipeArgs, 'id'>
  >
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>
  units?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
}>

export type RecipeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  ingredientGroups?: Resolver<
    Array<ResolversTypes['IngredientGroup']>,
    ParentType,
    ContextType
  >
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  Date?: GraphQLScalarType
  Ingredient?: IngredientResolvers<ContextType>
  IngredientGroup?: IngredientGroupResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Recipe?: RecipeResolvers<ContextType>
}>
