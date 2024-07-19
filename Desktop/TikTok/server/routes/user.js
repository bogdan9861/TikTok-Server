const { Router } = require("express");

const { login, register } = require("../controllers/user");

const router = Router();

router.get("/login", login);
router.post("/register", register);

module.exports = router;
