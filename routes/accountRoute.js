const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Route to build the login view at /account/login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Export the router
module.exports = router;