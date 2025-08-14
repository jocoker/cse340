/*
===============================================
 checkLogin Middleware
 Verifies if a user is logged in via JWT cookie
 and makes account info available to views.
===============================================
*/

const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Check if User is Logged In
 * **************************************** */
const checkLogin = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      // Verify token and decode account data
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
        if (err) {
          res.locals.loggedin = false;
          return next();
        }
        res.locals.loggedin = true;
        res.locals.accountData = accountData; // Make account info available in views
        return next();
      });
    } else {
      // No token = not logged in
      res.locals.loggedin = false;
      return next();
    }
  } catch (error) {
    res.locals.loggedin = false;
    return next();
  }
};

/* ****************************************
 *  Export Middleware
 * **************************************** */
module.exports = checkLogin;
