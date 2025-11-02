import type {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
import type {
  DbRecipe,
  DbIngredientGroup,
  DbIngredient,
} from './typeMappings.ts'
import type { Context } from './context.ts'
export type Maybe<T> =
  T extends PromiseLike<infer U>
    ? Promise<U | null | undefined | void>
    : T | null | undefined | void
export type InputMaybe<T> =
  T extends PromiseLike<infer U>
    ? Promise<U | null | undefined | void>
    : T | null | undefined | void
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
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
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
  deleteRecipe?: Maybe<Recipe>
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
  search: Array<Recipe>
  units: Array<Scalars['String']['output']>
}

export type QueryRecipeArgs = {
  id: Scalars['Int']['input']
}

export type QueryRecipesArgs = {
  category?: InputMaybe<Scalars['String']['input']>
  ids?: InputMaybe<Array<Scalars['Int']['input']>>
}

export type QuerySearchArgs = {
  query: Scalars['String']['input']
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

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
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
  TArgs,
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
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  Ingredient: ResolverTypeWrapper<DbIngredient>
  IngredientGroup: ResolverTypeWrapper<DbIngredientGroup>
  IngredientGroupInput: IngredientGroupInput
  IngredientInput: IngredientInput
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>
  Recipe: ResolverTypeWrapper<DbRecipe>
  RecipeInput: RecipeInput
  String: ResolverTypeWrapper<Scalars['String']['output']>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output']
  Date: Scalars['Date']['output']
  Ingredient: DbIngredient
  IngredientGroup: DbIngredientGroup
  IngredientGroupInput: IngredientGroupInput
  IngredientInput: IngredientInput
  Int: Scalars['Int']['output']
  Mutation: Record<PropertyKey, never>
  Query: Record<PropertyKey, never>
  Recipe: DbRecipe
  RecipeInput: RecipeInput
  String: Scalars['String']['output']
}>

export type LoggedInDirectiveArgs = {}

export type LoggedInDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = LoggedInDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type IngredientResolvers<
  ContextType = Context,
  ParentType extends
    ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient'],
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
}>

export type IngredientGroupResolvers<
  ContextType = Context,
  ParentType extends
    ResolversParentTypes['IngredientGroup'] = ResolversParentTypes['IngredientGroup'],
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
}>

export type MutationResolvers<
  ContextType = Context,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
  addRecipe?: Resolver<
    ResolversTypes['Recipe'],
    ParentType,
    ContextType,
    RequireFields<MutationAddRecipeArgs, 'recipe'>
  >
  deleteRecipe?: Resolver<
    Maybe<ResolversTypes['Recipe']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRecipeArgs, 'id'>
  >
  login?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'password'>
  >
  updateRecipe?: Resolver<
    ResolversTypes['Recipe'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateRecipeArgs, 'id' | 'recipe'>
  >
}>

export type QueryResolvers<
  ContextType = Context,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
  categories?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
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
  recipes?: Resolver<
    Array<ResolversTypes['Recipe']>,
    ParentType,
    ContextType,
    Partial<QueryRecipesArgs>
  >
  search?: Resolver<
    Array<ResolversTypes['Recipe']>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchArgs, 'query'>
  >
  units?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
}>

export type RecipeResolvers<
  ContextType = Context,
  ParentType extends
    ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe'],
> = ResolversObject<{
  categories?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
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
}>

export type Resolvers<ContextType = Context> = ResolversObject<{
  Date?: GraphQLScalarType
  Ingredient?: IngredientResolvers<ContextType>
  IngredientGroup?: IngredientGroupResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Recipe?: RecipeResolvers<ContextType>
}>

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  loggedIn?: LoggedInDirectiveResolver<any, any, ContextType>
}>
