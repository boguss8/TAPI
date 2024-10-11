import express from "express";

const app = new express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// https://fakerjs.dev/guide
