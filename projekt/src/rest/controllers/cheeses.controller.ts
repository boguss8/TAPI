import { Request, Response, NextFunction } from 'express';
import { Cheese } from '../models/cheese.model';
import { cheeses, reviews } from '../../data';
import { hateoas } from '../middlewares/hateoas';

export const getCheeses = (req: Request, res: Response, next: NextFunction) => {
  res.locals.data = cheeses.map((cheese) => ({
    ...cheese,
    reviews: cheese.reviews?.map((reviewRef) =>
      reviews.find((review) => review.id === reviewRef.id)
    ) || []
  }));
  hateoas(req, res, next);
};

export const getCheeseById = (req: Request, res: Response, next: NextFunction) => {
  const cheese = cheeses.find((c: Cheese) => c.id === req.params.id);
  if (cheese) {
    res.locals.data = {
      ...cheese,
      reviews: cheese.reviews?.map((reviewRef) =>
        reviews.find((review) => review.id === reviewRef.id)
      ) || []
    };
  } else {
    res.status(404).send('Cheese not found');
  }
  hateoas(req, res, next);
};

export const createCheese = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newCheese: Cheese = req.body;
  cheeses.push(newCheese);
  res.locals.data = {
    ...newCheese,
  };
  hateoas(req, res, next);
};

export const updateCheese = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = cheeses.findIndex((c: Cheese) => c.id === req.params.id);
  if (index !== -1) {
    cheeses[index] = req.body;
    res.locals.data = {
      ...cheeses[index],
    };
  } else {
    res.status(404).send('Cheese not found');
  }
  hateoas(req, res, next);
};

export const deleteCheese = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = cheeses.findIndex((c: Cheese) => c.id === req.params.id);
  if (index !== -1) {
    cheeses.splice(index, 1);
    res.locals.data = true;
    res.status(204);
  } else {
    res.locals.data = false;
    res.status(404).send('Cheese not found');
  }
  hateoas(req, res, next);
};
