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
  if (res.headersSent) {
    return next();
  }

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
      } else if (isCheeseWithReviews(item)) {
        item.reviews?.forEach((reviewRef) => {
          if (isReviewReference(reviewRef)) {
            addLinks(reviewRef, 'reviews');
          }
        });
      }
      return addLinks(item, item.constructor.name.toLowerCase() + 's');
    };

    if (Array.isArray(res.locals.data)) {
      res.locals.data = res.locals.data.map(processItem);
    } else {
      res.locals.data = processItem(res.locals.data);
    }
  }

  next();
};
