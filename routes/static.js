/*
===============================================
 Static File Routes
 Serves CSS, JS, and image files from /public
===============================================
*/

const express = require("express");
const path = require("path");

const router = express.Router();

// Serve everything inside /public
router.use(express.static(path.join(__dirname, "..", "public")));

module.exports = router;
