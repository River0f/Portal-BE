const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
  avatar: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, allowNull: false },
});

const Post = sequelize.define("post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
  short: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  body: { type: DataTypes.TEXT, allowNull: false },
});

const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Post);
Post.belongsTo(User);

Category.hasMany(Post);
Post.belongsTo(Category);

module.exports = {
  User,
  Post,
  Category,
};
