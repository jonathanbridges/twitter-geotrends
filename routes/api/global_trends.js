const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "This is the global trends route" }));

module.exports = router;