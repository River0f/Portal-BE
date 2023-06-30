const ApiError = require("../error/ApiError");
const { Post, User, Comments } = require("../models/models");
const { Category } = require("../models/models");
const uuid = require("uuid");
const path = require("path");

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
        include: [
          {
            model: Category,
            required: true,
            as: "category",
          },
          {
            model: User,
            required: true,
            as: "user",
            attributes: { exclude: "password, email" },
          },
        ],
        attributes: { exclude: "categoryId, body" },
      });
    } else {
      posts = await Post.findAndCountAll({
        limit: per_page,
        offset,
        include: [
          {
            model: Category,
            required: true,
            as: "category",
          },
          {
            model: User,
            required: true,
            as: "user",
            attributes: { exclude: "password, email" },
          },
        ],
        attributes: { exclude: "categoryId, body" },
      });
    }
    const postsWithMeta = {
      data: posts.rows.map((post) => ({
        id: post.id,
        title: post.title,
        short: post.short,
        image: post.image,
        body: post.body,
        category: post.category,
        date: post.createdAt,
        user: post.user,
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
      include: [
        {
          model: Category,
          required: true,
          as: "category",
        },
        {
          model: User,
          required: true,
          as: "user",
          attributes: { exclude: "password, email" },
        },
      ],
      attributes: { exclude: "categoryId" },
    });
    if (!post) {
      return next(ApiError.forbiden("Post not found"));
    }

    const comments = await Comments.findAll({
      where: { postid: id },
      include: { model: User, as: "user" },
    });
    const postToSend = {
      id: post.id,
      title: post.title,
      short: post.short,
      image: post.image,
      body: post.body,
      user: post.user,
      date: post.createdAt,
      category: post.category,
      comments: comments,
    };
    res.json(postToSend);
  }
  async create(req, res, next) {
    const { title, short, categoryId, body } = req.body;
    if (!title && !short && !categoryId && !body) {
      return next(ApiError.badRequest("Data is incorrect"));
    }

    const isPostWithSamename = await Post.findOne({ where: { title } });
    if (isPostWithSamename) {
      return next(
        ApiError.forbiden("Post with the same email is already exist")
      );
    }

    const { image } = req.files;
    let fileName = null;
    if (image) {
      fileName = uuid.v4() + ".jpeg";
      image.mv(path.resolve(__dirname, "..", "static", fileName));
    }
    const post = await Post.create({
      title,
      short,
      categoryId,
      body,
      userId: req.user.id,
      image: fileName,
    });
    res.json(post);
  }
  async edit(req, res) {}
  async delete(req, res) {}
  async createComment(req, res) {
    const { id } = req.params;
    const user = req.user;
    const { commentText } = req.body;
    const comment = await Comments.create({
      text: commentText,
      userid: user.id,
      postid: id,
    });
    res.json(comment);
  }
}

module.exports = new PostController();
