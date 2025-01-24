import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/review.model';
import { reviews, cheeses } from '../../data';
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
  const review = reviews.find((r: Review) => r.id === req.params.id);
  if (review) {
    res.locals.data = review;
    hateoas(req, res, next);
  } else {
    res.status(404).send('Review not found');
  }
};

export const createReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newReview: Review = req.body;
  reviews.push(newReview);
  res.locals.data = {
    ...newReview,
  };
  hateoas(req, res, next);
};

export const updateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = reviews.findIndex((r: Review) => r.id === req.params.id);
  if (index !== -1) {
    reviews[index] = req.body;
    res.locals.data = {
      ...reviews[index],
    };
    hateoas(req, res, next);
  } else {
    res.status(404).send('Review not found');
  }
};

export const deleteReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = reviews.findIndex((r: Review) => r.id === req.params.id);
  if (index !== -1) {
    reviews.splice(index, 1);
    res.locals.data = {};
    res.status(204).send();
  } else {
    res.status(404).send('Review not found');
  }
};
