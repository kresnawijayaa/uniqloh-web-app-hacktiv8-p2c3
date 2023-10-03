const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/products");
const deleteProductGuard = require("../middleware/deleteProductGuard");
const statusProductGuard = require("../middleware/statusProductGuard");

// post create product
router.get("/create", ProductsController.createForm);
router.post("/", ProductsController.create);

// get all data products
router.get("/", ProductsController.read);

// get all history data products
router.get("/history", ProductsController.history);

// get detail products
router.get("/:id", ProductsController.detail);

// delete products
router.delete("/:id", deleteProductGuard, ProductsController.delete);

// edit detail products
router.put("/:id", ProductsController.edit);

// change status products
router.patch("/:id", statusProductGuard, ProductsController.status);

module.exports = router;
