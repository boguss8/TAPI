import { cheeses, reviews } from '../../data';
import { Cheese } from '../../rest/models/cheese.model';
import { Review } from '../../rest/models/review.model';
import { GraphQLResolveInfo } from 'graphql';
import {
  StringFilterInput,
  NumberFilterInput,
  BooleanFilterInput,
  PaginationInput,
  SortInput,
} from '../types/filter.types';

interface CheeseFilterInput {
  name?: StringFilterInput;
  type?: StringFilterInput;
  ageInMonths?: NumberFilterInput;
  price?: NumberFilterInput;
  milkType?: StringFilterInput;
  origin?: StringFilterInput;
  isArtisanal?: BooleanFilterInput;
}

const filterString = (value: string, filter?: StringFilterInput): boolean => {
  if (!filter) return true;
  if (filter.eq && value !== filter.eq) return false;
  if (filter.contains && !value.includes(filter.contains)) return false;
  if (filter.ne && value === filter.ne) return false;
  if (filter.notContains && value.includes(filter.notContains)) return false;
  return true;
};

const filterNumber = (value: number, filter?: NumberFilterInput): boolean => {
  if (!filter) return true;
  if (filter.eq !== null && filter.eq !== undefined && value !== filter.eq)
    return false;
  if (filter.gt !== null && filter.gt !== undefined && value <= filter.gt)
    return false;
  if (filter.gte !== null && filter.gte !== undefined && value < filter.gte)
    return false;
  if (filter.lt !== null && filter.lt !== undefined && value >= filter.lt)
    return false;
  if (filter.lte !== null && filter.lte !== undefined && value > filter.lte)
    return false;
  if (filter.ne !== null && filter.ne !== undefined && value === filter.ne)
    return false;
  return true;
};

const filterBoolean = (
  value: boolean,
  filter?: BooleanFilterInput
): boolean => {
  return !filter || filter.eq === null || value === filter.eq;
};

const applySorting = (items: Cheese[], sort?: SortInput<Cheese>): Cheese[] => {
  if (!sort) return items;
  return [...items].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    const multiplier = sort.order === 'ASC' ? 1 : -1;
    return typeof aValue === 'string' && typeof bValue === 'string'
      ? aValue.localeCompare(bValue) * multiplier
      : ((aValue as number) - (bValue as number)) * multiplier;
  });
};

const applyPagination = (
  items: Cheese[],
  pagination?: PaginationInput
): Cheese[] => {
  if (!pagination) return items;
  return items.slice(pagination.offset, pagination.offset + pagination.limit);
};

export const cheeseResolvers = {
  Query: {
    cheeses: (
      _parent: null,
      {
        filter,
        sort,
        pagination,
      }: {
        filter?: CheeseFilterInput;
        sort?: SortInput<Cheese>;
        pagination?: PaginationInput;
      },
      _info: GraphQLResolveInfo
    ) => {
      let result = cheeses;

      if (filter) {
        result = result.filter((cheese) => {
          const ageInMonths = cheese.ageInMonths || 0;
          const price = cheese.price || 0;

          const nameMatch = cheese.name
            ? filterString(cheese.name, filter.name)
            : true;
          const typeMatch = cheese.type
            ? filterString(cheese.type, filter.type)
            : true;
          const ageMatch = filterNumber(ageInMonths, filter.ageInMonths);
          const priceMatch = filterNumber(price, filter.price);
          const milkTypeMatch = cheese.milkType
            ? filterString(cheese.milkType, filter.milkType)
            : true;
          const originMatch = cheese.origin
            ? filterString(cheese.origin, filter.origin)
            : true;
          const artisanalMatch =
            cheese.isArtisanal !== undefined
              ? filterBoolean(cheese.isArtisanal, filter.isArtisanal)
              : true;

          return (
            nameMatch &&
            typeMatch &&
            ageMatch &&
            priceMatch &&
            milkTypeMatch &&
            originMatch &&
            artisanalMatch
          );
        });
      }

      result = applySorting(result, sort);
      result = applyPagination(result, pagination);

      return {
        nodes: result,
        pageInfo: {
          hasNextPage:
            result.length >
            (pagination?.offset || 0) + (pagination?.limit || result.length),
          hasPreviousPage: (pagination?.offset || 0) > 0,
        },
        totalCount: result.length,
      };
    },

    cheese: (_parent: null, { id }: { id: string }) =>
      cheeses.find((c) => c.id === id) || null,
  },

  Mutation: {
    createCheese: (
      _parent: null,
      { input }: { input: Omit<Cheese, 'id' | 'reviews'> }
    ) => {
      const newCheese = {
        ...input,
        id: String(cheeses.length + 1),
        reviews: [],
      };
      cheeses.push(newCheese);
      return newCheese;
    },

    updateCheese: (
      _parent: null,
      { input }: { input: Partial<Cheese> & { id: string } }
    ) => {
      const index = cheeses.findIndex((c) => c.id === input.id);
      if (index === -1) throw new Error('Cheese not found');
      cheeses[index] = { ...cheeses[index], ...input };
      return cheeses[index];
    },

    deleteCheese: (_parent: null, { id }: { id: string }) => {
      const index = cheeses.findIndex((c) => c.id === id);
      if (index === -1) return false;
      cheeses.splice(index, 1);
      return true;
    },
  },

  Cheese: {
    reviews: (cheese: Cheese): Review[] =>
      reviews.filter((r) =>
        cheese.reviews?.some((review) => review.id === r.id)
      ),
  },
};
