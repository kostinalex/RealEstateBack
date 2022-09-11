const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

const postingsController = require("./Controllers/postingsController.js");

const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/api/getListings", postingsController.getListings);

app.listen(port, "127.0.0.1", () => {
  console.log(`App listening on port ${port}`);
});
