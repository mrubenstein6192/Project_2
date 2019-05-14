const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.irlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));


const routes = require("./routes");

app.listen(PORT, () => console.log(`Listening on Localhost:${PORT}`));