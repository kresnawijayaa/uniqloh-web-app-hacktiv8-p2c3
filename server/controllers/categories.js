const { User, Category, Product } = require("../models")

class CategoriesController {
    static async read(req, res, next) {
        try {
            const categories = await Category.findAll()
            res.status(200).json(categories)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CategoriesController