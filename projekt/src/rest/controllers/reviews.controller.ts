import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/review.model';
import { reviews } from '../../data';
import { hateoas } from '../middlewares/hateoas';

export const getReviews = (req: Request, res: Response, next: NextFunction) => {
  res.locals.data = reviews;
  hateoas(req, res, next);
};

export const getReviewById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const review = reviews.find((r) => r.id === req.params.id);
  if (review) {
    res.locals.data = review;
  } else {
    res.status(404).send('Review not found');
  }
  hateoas(req, res, next);
};

export const createReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newReview: Review = req.body;
  newReview.id = `${reviews.length + 1}`;
  reviews.push(newReview);
  res.locals.data = newReview;
  hateoas(req, res, next);
};

export const updateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = reviews.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    reviews[index] = { ...reviews[index], ...req.body };
    res.locals.data = reviews[index];
  } else {
    res.status(404).send('Review not found');
  }
  hateoas(req, res, next);
};

export const deleteReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = reviews.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    reviews.splice(index, 1);
    res.locals.data = true;
    res.status(204);
  } else {
    res.locals.data = false;
    res.status(404).send('Review not found');
  }
  hateoas(req, res, next);
};
