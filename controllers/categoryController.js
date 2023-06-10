const { Category } = require("../models/models");
const ApiError = require("../error/ApiError");

class CategoryController {
  async getAll(req, res) {
    const categories = await Category.findAll();
    res.json(categories);
  }
  async create(req, res) {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json(category);
  }
  async edit(req, res) {}
  async delete(req, res) {}
}

module.exports = new CategoryController();
