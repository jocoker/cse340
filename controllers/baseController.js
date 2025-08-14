/*
===============================================
 Base Controller
 Handles top-level routes like the home page.
===============================================
*/

const utilities = require("../utilities/");
const baseController = {};

/* ****************************************
 *  Show Home Page
 * **************************************** */
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("index", {
    title: "Home",
    nav,
    errors: null, // keeps "errors is not defined" from crashing the view
    message: req.flash("notice"), // flash messages support
  });
};

/* ****************************************
 *  Export Controller
 * **************************************** */
module.exports = baseController;
