const express = require("express");
const router = express.Router();

const {
  PubAuthController,
  PubProductsController,
  PubFavoritesController,
  PubCategoriesController,
} = require("../controllers/publics");
const authenticationCustomer = require("../middleware/authenticationCustomer");

router.post("/google-login", PubAuthController.googleLogin);
router.post("/register", PubAuthController.register);
router.post("/login", PubAuthController.login);
router.get("/products", PubProductsController.read);
router.get("/products/:id", PubProductsController.detail);
router.get("/categories", PubCategoriesController.read);
router.use(authenticationCustomer);
router.get("/favorites", PubFavoritesController.read);
router.post("/favorites/:id", PubFavoritesController.add);

module.exports = router;
