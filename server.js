const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.irlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/travelsearch";
mongoose.Promise = Promise;
mongoose.connect(mongoUri, {
  useNewUrlParser: true
});

const routes = require("./routes");
app.use(routes);

app.listen(PORT, () => console.log(`Listening on Localhost:${PORT}`));