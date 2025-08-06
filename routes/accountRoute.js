const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Route to build the login view at /account/login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post('/register', utilities.handleErrors(accountController.registerAccount));
// Route to build the register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Export the router
module.exports = router;