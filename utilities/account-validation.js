/*
===============================================
 Account Validation Middleware
 Handles input validation for registration,
 login, updates, and password changes.
===============================================
*/

const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

// =====================
// Registration Rules
// =====================
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

// =====================
// Check Registration Data
// =====================
const checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

// =====================
// Login Rules
// =====================
const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

// =====================
// Check Login Data
// =====================
const checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

// =====================
// Update Account Rules
// =====================
const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ];
};

// =====================
// Check Update Account Data
// =====================
const checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors,
      accountData: {
        account_id: req.body.account_id,
        account_firstname,
        account_lastname,
        account_email,
      },
    });
    return;
  }
  next();
};

// =====================
// Password Rules
// =====================
const passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol."
      ),
  ];
};

// =====================
// Check Password Data
// =====================
const checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);

    return res.status(400).render("account/update-account", {
      title: "Update Account",
      nav,
      errors,
      accountData,
    });
  }
  next();
};

// =====================
// Module Exports
// =====================
module.exports = {
  registrationRules,
  checkRegData,
  loginRules,
  passwordRules,
  updateAccountRules,
  checkUpdateAccountData,
  checkPasswordData,
  checkLoginData,
};
