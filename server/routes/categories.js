const express = require('express')
const router = express.Router()
const CategoriesController = require("../controllers/categories")

// post create categories
// router.post('/', CategoriesController.create)

// get all data categories
router.get('/', CategoriesController.read)

// delete categories
// router.delete('/:id', CategoriesController.delete)

module.exports = router