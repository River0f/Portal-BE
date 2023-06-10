const ApiError = require("../error/ApiError");
const { Post } = require("../models/models");
const { Category } = require("../models/models");

class PostController {
  async getAll(req, res) {
    let { categoryId, per_page, page } = req.query;
    page = page || 1;
    per_page = per_page || 9;
    let offset = page * per_page - per_page;
    let posts;
    if (categoryId) {
      posts = await Post.findAndCountAll({
        where: { categoryId },
        per_page,
        offset,
        include: {
          model: Category,
          required: true,
          as: "category",
        },
        attributes: { exclude: "categoryId" },
      });
    } else {
      posts = await Post.findAndCountAll({
        limit: per_page,
        offset,
        include: {
          model: Category,
          required: true,
          as: "category",
        },
        attributes: { exclude: "categoryId" },
      });
    }
    const postsWithMeta = {
      data: posts.rows.map((post) => ({
        id: post.id,
        title: post.title,
        short: post.short,
        image: post.image,
        body: post.body,
        category: post.category.name,
      })),
      meta: {
        page,
        per_page,
        total_pages: Math.ceil(posts.count / per_page),
      },
    };
    res.json(postsWithMeta);
  }
  async getOne(req, res, next) {
    const { id } = req.params;
    const post = await Post.findOne({
      where: { id },
      include: {
        model: Category,
        required: true,
        as: "category",
      },
      attributes: { exclude: "categoryId" },
    });
    if (!post) {
      return next(ApiError.forbiden("Post not found"));
    }
    const postToSend = {
      id: post.id,
      title: post.title,
      short: post.short,
      image: post.image,
      body: post.body,
      category: post.category.name,
    };
    res.json(postToSend);
  }
  async create(req, res) {
    const { title, short, categoryId, body } = req.body;
    const post = await Post.create({
      title,
      short,
      categoryId,
      body,
      userId: 1,
    });
    res.json(post);
  }
  async edit(req, res) {}
  async delete(req, res) {}
}

module.exports = new PostController();
