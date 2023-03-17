import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema, GraphQLError } from 'graphql'

export const schemaTransformer = (schema: GraphQLSchema) =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const loggedInDirective = getDirective(
        schema,
        fieldConfig,
        'loggedIn'
      )?.[0]

      if (loggedInDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig
        fieldConfig.resolve = async function (...resolverArgs) {
          const [, , { isLoggedIn }] = resolverArgs
          if (!isLoggedIn) {
            throw new GraphQLError(
              'You must be logged in to access this resource.',
              {
                extensions: {
                  code: 'UNAUTHENTICATED',
                },
              }
            )
          }
          return await resolve.apply(this, resolverArgs)
        }
        return fieldConfig
      }

      return fieldConfig
    },
  })
