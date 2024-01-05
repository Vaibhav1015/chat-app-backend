const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(cors());
app.use(express.json());

//Mongodb connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Server listen
const port = process.env.PORT;
app.listen(port || 3001, () => {
  console.log(`Server listening on port ${port}`);
});
