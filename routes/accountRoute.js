/*
===============================================
 Account Routes
 Handles all account-related endpoints:
 login, registration, dashboard, updates, and logout.
===============================================
*/

const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

/* ***************
 *  GET Routes
 * *************** */

// Show login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Show registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Default account dashboard (after successful login redirect)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Show account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

/* ***************
 *  POST Routes
 * *************** */

// Process registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process account info update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password change
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

/* ***************
 *  LOGOUT Route
 * *************** */
router.get("/logout", utilities.handleLogout);

module.exports = router;
