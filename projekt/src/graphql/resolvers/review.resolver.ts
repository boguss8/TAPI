import { reviews, cheeses } from '../../data';
import { Review } from '../../rest/models/review.model';
import { Cheese } from '../../rest/models/cheese.model';
import { GraphQLResolveInfo } from 'graphql';
import {
  StringFilterInput,
  NumberFilterInput,
  BooleanFilterInput,
  DateFilterInput,
  PaginationInput,
  SortInput,
} from '../types/filter.types';

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

const applySorting = (items: Review[], sort?: SortInput<Review>): Review[] => {
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
  items: Review[],
  pagination?: PaginationInput
): Review[] => {
  if (!pagination) return items;
  return items.slice(pagination.offset, pagination.offset + pagination.limit);
};

interface RatingsFilterInput {
  flavor?: NumberFilterInput;
  texture?: NumberFilterInput;
  value?: NumberFilterInput;
  packaging?: NumberFilterInput;
  overall?: NumberFilterInput;
}

interface ReviewFilterInput {
  comment?: StringFilterInput;
  verifiedPurchase?: BooleanFilterInput;
  datePosted?: DateFilterInput;
  helpfulVotes?: NumberFilterInput;
  wouldRecommend?: BooleanFilterInput;
  ratings?: RatingsFilterInput;
}

const filterDate = (value: string, filter?: DateFilterInput): boolean => {
  if (!filter) return true;
  const dateValue = new Date(value).getTime();
  const eq = filter.eq ? new Date(filter.eq).getTime() : null;
  const gt = filter.gt ? new Date(filter.gt).getTime() : null;
  const gte = filter.gte ? new Date(filter.gte).getTime() : null;
  const lt = filter.lt ? new Date(filter.lt).getTime() : null;
  const lte = filter.lte ? new Date(filter.lte).getTime() : null;
  const ne = filter.ne ? new Date(filter.ne).getTime() : null;

  if (eq !== null && dateValue !== eq) return false;
  if (gt !== null && dateValue <= gt) return false;
  if (gte !== null && dateValue < gte) return false;
  if (lt !== null && dateValue >= lt) return false;
  if (lte !== null && dateValue > lte) return false;
  if (ne !== null && dateValue === ne) return false;
  return true;
};

const filterRatings = (
  ratings: Review['ratings'],
  filter?: RatingsFilterInput
): boolean => {
  if (!filter) return true;
  if (filter.flavor && !filterNumber(ratings.flavor, filter.flavor))
    return false;
  if (filter.texture && !filterNumber(ratings.texture, filter.texture))
    return false;
  if (filter.value && !filterNumber(ratings.value, filter.value)) return false;
  if (filter.packaging && !filterNumber(ratings.packaging, filter.packaging))
    return false;
  if (filter.overall && !filterNumber(ratings.overall, filter.overall))
    return false;
  return true;
};

export const reviewResolvers = {
  Query: {
    reviews: (
      _parent: null,
      {
        filter,
        sort,
        pagination,
      }: {
        filter?: ReviewFilterInput;
        sort?: SortInput<Review>;
        pagination?: PaginationInput;
      },
      _info: GraphQLResolveInfo
    ) => {
      let result = reviews;

      if (filter) {
        result = result.filter((review) => {
          const commentMatch = filter.comment
            ? filterString(review.comment, filter.comment)
            : true;
          const verifiedMatch = filter.verifiedPurchase
            ? filterBoolean(review.verifiedPurchase, filter.verifiedPurchase)
            : true;
          const dateMatch = filter.datePosted
            ? filterDate(review.datePosted, filter.datePosted)
            : true;
          const votesMatch = filter.helpfulVotes
            ? filterNumber(review.helpfulVotes, filter.helpfulVotes)
            : true;
          const recommendMatch = filter.wouldRecommend
            ? filterBoolean(review.wouldRecommend, filter.wouldRecommend)
            : true;
          const ratingsMatch = filter.ratings
            ? filterRatings(review.ratings, filter.ratings)
            : true;

          return (
            commentMatch &&
            verifiedMatch &&
            dateMatch &&
            votesMatch &&
            recommendMatch &&
            ratingsMatch
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

    review: (_parent: null, { id }: { id: string }) =>
      reviews.find((r) => r.id === id) || null,
  },

  Mutation: {
    createReview: (_parent: null, { input }: { input: Omit<Review, 'id'> }) => {
      const newReview = {
        id: String(reviews.length + 1),
        ...input,
      };
      reviews.push(newReview);
      const cheese = cheeses.find(c => c.id === input.cheeseId);
      if (cheese) {
        if (!cheese.reviews) {
          cheese.reviews = [];
        }
        cheese.reviews.push({ id: newReview.id });
      } else {
        throw new Error('Cheese not found');
      }

      return newReview;
    },

    updateReview: (
      _parent: null,
      { input }: { input: Partial<Review> & { id: string } }
    ) => {
      const index = reviews.findIndex((r) => r.id === input.id);
      if (index === -1) throw new Error('Review not found');
      reviews[index] = { ...reviews[index], ...input };
      return reviews[index];
    },

    deleteReview: (_parent: null, { id }: { id: string }) => {
      const index = reviews.findIndex((r) => r.id === id);
      if (index === -1) return false;
      reviews.splice(index, 1);
      return true;
    },
  },

  Review: {
    cheese: (review: Review): Cheese | null =>
      cheeses.find((c) => c.id === review.cheeseId) || null,
  },
};
