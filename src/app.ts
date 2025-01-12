require("dotenv").config();

import routes from "./routes/routes";

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(routes);
app.listen(port);

module.exports = app;