import fs from "fs";
import { generateCheese } from "./generator.js";

const cheeseData = [];

for (let i = 1; i <= 10; i++) {
  cheeseData.push(generateCheese(i));
}

fs.writeFileSync("cheese.json", JSON.stringify(cheeseData, null, 2), "utf-8");
console.log("Cheese data has been generated and saved to cheese.json");
