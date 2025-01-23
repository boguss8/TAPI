import { manufacturers, cheeses } from '../../data';
import { Manufacturer } from '../../rest/models/manufacturer.model';
import { Cheese } from '../../rest/models/cheese.model';
import { GraphQLResolveInfo } from 'graphql';
import {
  StringFilterInput,
  NumberFilterInput,
  BooleanFilterInput,
  PaginationInput,
  SortInput,
} from '../types/filter.types';
import { URLScalar } from '../scalars/url.scalar';

interface ManufacturerFilterInput {
  name?: StringFilterInput;
  country?: StringFilterInput;
  foundedYear?: NumberFilterInput;
  employeeCount?: NumberFilterInput;
  website?: StringFilterInput;
  isOrganic?: BooleanFilterInput;
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
  if (!filter || filter.eq === undefined) return true;
  return value === filter.eq;
};

const applySorting = (
  items: Manufacturer[],
  sort?: SortInput<Manufacturer>
): Manufacturer[] => {
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
  items: Manufacturer[],
  pagination?: PaginationInput
): Manufacturer[] => {
  if (!pagination) return items;
  return items.slice(pagination.offset, pagination.offset + pagination.limit);
};

export const manufacturerResolvers = {
  Query: {
    manufacturers: (
      _parent: null,
      {
        filter,
        sort,
        pagination,
      }: {
        filter?: ManufacturerFilterInput;
        sort?: SortInput<Manufacturer>;
        pagination?: PaginationInput;
      },
      _info: GraphQLResolveInfo
    ) => {
      let result = manufacturers;

      if (filter) {
        result = result.filter((m) => {
          const nameMatch = filterString(m.name, filter.name);
          const countryMatch = filterString(m.country, filter.country);
          const foundedYearMatch = filterNumber(
            m.foundedYear,
            filter.foundedYear
          );
          const employeeCountMatch = filterNumber(
            m.employeeCount,
            filter.employeeCount
          );
          const websiteMatch = filterString(m.website, filter.website);
          const isOrganicMatch = filterBoolean(m.isOrganic, filter.isOrganic);

          return (
            nameMatch &&
            countryMatch &&
            foundedYearMatch &&
            employeeCountMatch &&
            websiteMatch &&
            isOrganicMatch
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

    manufacturer: (
      _parent: null,
      { id }: { id: string },
      _info: GraphQLResolveInfo
    ) => manufacturers.find((m) => m.id === id) || null,
  },

  Mutation: {
    createManufacturer: (
      _parent: null,
      { input }: { input: Omit<Manufacturer, 'id'> }
    ) => {
      const newManufacturer = {
        id: String(manufacturers.length + 1),
        ...input,
      };
      manufacturers.push(newManufacturer);
      return newManufacturer;
    },

    updateManufacturer: (
      _parent: null,
      { input }: { input: Partial<Manufacturer> & { id: string } }
    ) => {
      const index = manufacturers.findIndex((m) => m.id === input.id);
      if (index === -1) throw new Error('Manufacturer not found');
      manufacturers[index] = { ...manufacturers[index], ...input };
      return manufacturers[index];
    },

    deleteManufacturer: (_parent: null, { id }: { id: string }) => {
      const index = manufacturers.findIndex((m) => m.id === id);
      if (index === -1) return false;
      manufacturers.splice(index, 1);
      return true;
    },
  },

  Manufacturer: {
    producedCheeses: (manufacturer: Manufacturer): Cheese[] =>
      cheeses.filter((cheese) =>
        manufacturer.producedCheeses.includes(cheese.id)
      ),
  },

  URL: URLScalar,
};
