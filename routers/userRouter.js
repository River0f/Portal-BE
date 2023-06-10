const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/AuthMiddleware");

const userController = require("../controllers/userController");

router.post("/registration", userController.registraton);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);

module.exports = router;
