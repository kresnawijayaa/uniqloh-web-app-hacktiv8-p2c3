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
// favorites
router.get("/favorites", PubFavoritesController.read);
router.post("/favorites/:id", PubFavoritesController.add);
router.delete("/favorites/:id", PubFavoritesController.remove);
router.post("/favorites/:id/toggle", PubFavoritesController.toggle);

module.exports = router;
