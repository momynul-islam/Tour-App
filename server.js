const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE)
  .then((connection) => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Tour-App server listening at port ${port}...`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });
