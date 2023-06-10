const ApiError = require("../error/ApiError");
const { User } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const genereteJWT = (id, email, role) => {
  return (token = jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  }));
};

class UserController {
  async registraton(req, res, next) {
    const { email, password, nickname } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email or password is not correct"));
    }

    const isUserWithSameEmail = await User.findOne({ where: { email } });
    if (isUserWithSameEmail) {
      return next(
        ApiError.forbiden("User with the same email is already exist")
      );
    }

    const isUserWithSameNickname = await User.findOne({ where: { nickname } });
    if (isUserWithSameNickname) {
      return next(
        ApiError.forbiden("User with the same nickname is already exist")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
      email,
      password: hashedPassword,
      nickname,
      role: "user",
    });
    const token = genereteJWT(user.id, user.email, user.role);
    res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email or password is not correct"));
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.notFound("User with this email is not exist"));
    }
    const comparedPasswd = bcrypt.compareSync(password, user.password);
    if (!comparedPasswd) {
      return next(ApiError.internal("Password is not correct"));
    }
    const token = genereteJWT(user.id, user.email, user.role);
    res.json({ token });
  }

  async check(req, res, next) {
    const token = genereteJWT(req.user.id, req.user.email, req.user.role);
    res.json({ token });
  }
}

module.exports = new UserController();
