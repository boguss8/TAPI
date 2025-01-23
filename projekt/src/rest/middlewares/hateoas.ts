import { Request, Response, NextFunction } from 'express';
import { Manufacturer } from '../models/manufacturer.model';
import { Cheese } from '../models/cheese.model';
import { Review } from '../models/review.model';
import { reviews } from '../../data';

type ResourceType = Manufacturer | Cheese | Review;
type ResourceWithReviews = { reviews?: { id: string }[] };
type ProcessedCheeseRef = { id: string } & Partial<Cheese>;

function isManufacturer(item: ResourceType): item is Manufacturer {
  return 'producedCheeses' in item;
}

function isCheeseWithReviews(
  item: ResourceType
): item is Cheese & ResourceWithReviews {
  return 'type' in item;
}

function isReviewReference(item: { id: string }): item is { id: string } {
  return typeof item.id === 'string';
}

export const hateoas = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.data) {
    const addLinks = (
      item: ResourceType | ProcessedCheeseRef,
      type: string
    ) => {
      if (item.id) {
        item.links = [
          {
            rel: 'self',
            href: `${req.protocol}://${req.get('host')}/${type}/${item.id}`,
          },
        ];
      }
      return item;
    };

    const processItem = (item: ResourceType) => {
      if (isManufacturer(item)) {
        const processedCheeses: string[] = item.producedCheeses;
        processedCheeses.forEach((cheeseId) => {
          addLinks({ id: cheeseId } as ProcessedCheeseRef, 'cheeses');
        });
      }

      if (isCheeseWithReviews(item) && item.reviews) {
        item.reviews = item.reviews.map((reviewRef) => {
          if (isReviewReference(reviewRef)) {
            const foundReview = reviews.find(
              (r: Review) => r.id === reviewRef.id
            );
            return foundReview ? addLinks(foundReview, 'reviews') : reviewRef;
          }
          return reviewRef;
        });
      }

      return addLinks(item, req.baseUrl.split('/').pop() || '');
    };

    if (Array.isArray(res.locals.data)) {
      res.locals.data = res.locals.data.map(processItem);
    } else {
      res.locals.data = processItem(res.locals.data);
    }
  }
  next();
};
