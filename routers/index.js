const Router = require("express");
const router = new Router();

const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const categoryRouter = require("./categoryRouter");

router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/categories", categoryRouter);

module.exports = router;
