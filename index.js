require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 5000;

const router = require("./routers");
const models = require("./models/models");
const fileUpload = require("express-fileupload");

const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, "static")));
app.use("/api", router);

// Errors middleware
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server was started on port: ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
