if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

const publics = require("./routes/publics");
const products = require("./routes/products");
const categories = require("./routes/categories");
const AuthController = require("./controllers/auth");
const authentication = require("./middleware/authentication");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req, res) => {
  res.send('Hello Temennya Kresna!')
})
app.use("/pub", publics);
app.post("/google-login", AuthController.googleLogin);
app.post("/register", AuthController.register);
app.post("/login", AuthController.login);
app.use(authentication);
app.use("/products", products);
app.use("/categories", categories);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port} `);
});

module.exports = app;
