const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');


// Route to build the login view at /account/login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route to build the register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default account dashboard (after successful login redirect)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)


// Export the router
module.exports = router;