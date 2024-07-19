const { Router } = require("express");
const fileMW = require("../midleware/file");
const { post } = require("../controllers/video");
const { auth } = require("../midleware/auth");

const router = Router();

router.post("/post", fileMW.single("video"), auth, post);

module.exports = router;
