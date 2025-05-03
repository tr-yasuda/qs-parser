/**
 * Shared utility functions for schema implementations
 */

/**
 * Creates a schema with the given constraints
 *
 * This is a generic utility function that can be used by different schema implementations
 * to create a new schema with updated constraints. It abstracts the common pattern of
 * creating a new schema with merged constraints.
 *
 * @param constraints - The constraints to apply to the schema
 * @param schemaFactory - A function that creates a schema with the given constraints
 * @returns A new schema with the given constraints
 */
export function createSchemaWithConstraints<TConstraints, TSchema>(
  constraints: TConstraints,
  schemaFactory: (constraints: TConstraints) => TSchema,
): TSchema {
  return schemaFactory(constraints);
}
