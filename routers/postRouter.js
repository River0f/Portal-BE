const Router = require("express");
const router = new Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, postController.create);
router.get("/", postController.getAll);
router.get("/:id", postController.getOne);
router.post(
  "/:id/create-comment",
  authMiddleware,
  postController.createComment
);
router.put("/:id", postController.edit);
router.delete("/:id", postController.delete);

module.exports = router;
