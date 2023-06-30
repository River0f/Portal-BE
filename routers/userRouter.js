const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/AuthMiddleware");

const userController = require("../controllers/userController");

router.post("/registration", userController.registraton);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/me", authMiddleware, userController.me);

module.exports = router;
