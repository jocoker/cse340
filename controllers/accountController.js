/*
===============================================
 Account Controller
 Handles all things account-related:
 login, registration, updates, and dashboard.
===============================================
*/

const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Show Login Page
 * **************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    message: req.flash("notice"),
  });
}

/* ****************************************
 *  Show Registration Page
 * **************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: req.flash("notice"),
  });
}

/* ****************************************
 *  Handle New Account Registration
 * **************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  }
}

/* ****************************************
 *  Show Account Dashboard
 * **************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: req.flash("notice"),
  });
}

/* ****************************************
 *  Handle Login
 * **************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData || !accountData.account_password) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      message: req.flash("notice"),
    });
  }

  try {
    const ok = await bcrypt.compare(account_password, accountData.account_password);
    if (!ok) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        message: req.flash("notice"),
      });
    }

    // Remove password from the returned object
    delete accountData.account_password;

    // Generate JWT token
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

    // Cookie setup
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000,
      sameSite: "lax",
    };
    if (process.env.NODE_ENV !== "development") cookieOptions.secure = true;

    res.cookie("jwt", accessToken, cookieOptions);

    return res.redirect("/account/");
  } catch (err) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Show Update Account Form
 * **************************************** */
async function buildUpdateAccount(req, res) {
  const accountData = res.locals.accountData;
  const nav = await utilities.getNav();
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
  });
}

/* ****************************************
 *  Handle Account Info Update
 * **************************************** */
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.");
    return res.redirect("/account/");
  } else {
    const nav = await utilities.getNav();
    req.flash("notice", "Update failed. Please try again.");
    return res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: { account_id, account_firstname, account_lastname, account_email },
    });
  }
}

/* ****************************************
 *  Handle Password Update
 * **************************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);

  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
    return res.redirect("/account/");
  } else {
    const nav = await utilities.getNav();
    req.flash("notice", "Password update failed.");
    return res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: await accountModel.getAccountById(account_id),
    });
  }
}

/* ****************************************
 *  Export Controller Functions
 * **************************************** */
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
};
