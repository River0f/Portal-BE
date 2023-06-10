const Router = require("express");
const router = new Router();

const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.create);
router.get("/", categoryController.getAll);
router.put("/:id", categoryController.edit);
router.delete("/:id", categoryController.delete);

module.exports = router;
