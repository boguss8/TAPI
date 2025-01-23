import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

export const URLScalar = new GraphQLScalarType({
  name: 'URL',
  description: 'URL custom scalar type',

  serialize(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('URL must be a string');
    }
    try {
      new URL(value);
      return value;
    } catch {
      throw new Error('Invalid URL');
    }
  },

  parseValue(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('URL must be a string');
    }
    try {
      new URL(value);
      return value;
    } catch {
      throw new Error('Invalid URL');
    }
  },

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new Error('URL must be a string');
    }
    try {
      new URL(ast.value);
      return ast.value;
    } catch {
      throw new Error('Invalid URL');
    }
  },
});
