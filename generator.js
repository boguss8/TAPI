import { faker } from "@faker-js/faker";

export const generateBook = (id) => {
  return {
    id: id,
    isbn: faker.commerce.isbn(),
    title: faker.commerce.productName(),
  };
};

export const generateCheese = (id) => {
  return {
    id: id,
    name: faker.commerce.productName(),
    origin: faker.address.country(),
    price: faker.commerce.price(),
  };
};
