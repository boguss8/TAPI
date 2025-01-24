import { Request, Response, NextFunction } from 'express';
import { Manufacturer } from '../models/manufacturer.model';
import { manufacturers, cheeses, reviews } from '../../data';
import { hateoas } from '../middlewares/hateoas';

export const getManufacturers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.data = manufacturers.map((manufacturer) => ({
    ...manufacturer,
    producedCheeses: manufacturer.producedCheeses.map((cheeseId) => {
      const cheese = cheeses.find((cheese) => cheese.id === cheeseId);
      return {
        ...cheese,
        reviews:
          cheese?.reviews?.map((reviewRef) =>
            reviews.find((review) => review.id === reviewRef.id)
          ) || [],
      };
    }),
  }));
  hateoas(req, res, next);
};

export const getManufacturerById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const manufacturer = manufacturers.find((m) => m.id === req.params.id);
  if (manufacturer) {
    res.locals.data = {
      ...manufacturer,
      producedCheeses: manufacturer.producedCheeses.map((cheeseId) => {
        const cheese = cheeses.find((cheese) => cheese.id === cheeseId);
        return {
          ...cheese,
          reviews:
            cheese?.reviews?.map((reviewRef) =>
              reviews.find((review) => review.id === reviewRef.id)
            ) || [],
        };
      }),
    };
    hateoas(req, res, next);
  } else {
    res.status(404).send('Manufacturer not found');
  }
};

export const createManufacturer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newManufacturer: Manufacturer = req.body;
  manufacturers.push(newManufacturer);
  res.locals.data = {
    ...newManufacturer,
  };
  hateoas(req, res, next);
};

export const updateManufacturer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = manufacturers.findIndex((m) => m.id === req.params.id);
  if (index !== -1) {
    manufacturers[index] = req.body;
    res.locals.data = {
      ...manufacturers[index],
    };
    hateoas(req, res, next);
  } else {
    res.status(404).send('Manufacturer not found');
  }
};

export const deleteManufacturer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const index = manufacturers.findIndex((m) => m.id === req.params.id);
  if (index !== -1) {
    manufacturers.splice(index, 1);
    res.locals.data = {};
    res.status(204).send();
  } else {
    res.status(404).send('Manufacturer not found');
  }
};
