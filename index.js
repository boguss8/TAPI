import express from "express";
import fs from "fs";
import { generateBook, generateCheese } from "./generator.js";

const app = express();
const port = 3000;

app.get("/api/book/:id", (req, res) => {
  const id = req.params.id;
  const book = generateBook(id);
  res.json(book);
});

app.get("/api/cheese/:id", (req, res) => {
  const id = req.params.id;
  const cheese = generateCheese(id);
  res.json(cheese);
});

app.get("/api/cheeses", (req, res) => {
  fs.readFile("cheese.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading cheese data");
      return;
    }
    const cheeses = JSON.parse(data);
    res.json(cheeses);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
