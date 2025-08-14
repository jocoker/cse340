/*
===============================================
 Favorite Controller
 Lets users save and manage their favorite vehicles.
===============================================
*/

const { body, validationResult } = require("express-validator");
const favoriteModel = require("../models/favorite-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

/* ****************************************
 *  Validation Rules
 * **************************************** */
const validateSave = [
  body("inv_id").isInt({ min: 1 }).withMessage("Invalid vehicle."),
];

const validateUnsave = [
  body("inv_id").isInt({ min: 1 }).withMessage("Invalid vehicle."),
];

/* ****************************************
 *  Show Favorites List Page
 * **************************************** */
async function buildFavorites(req, res) {
  try {
    const account_id = res.locals.accountData.account_id;
    const favs = await favoriteModel.listFavoritesByAccount(account_id);
    const nav = await utilities.getNav();

    res.render("account/favorites", {
      title: "My Saved Vehicles",
      nav,
      favorites: favs,
      errors: null,
      message: req.flash("notice"),
    });
  } catch (err) {
    console.error(err); // Keeping this for real error logging
    res.status(500).render("errors/error", {
      title: "Error",
      message: "Could not load your saved vehicles.",
    });
  }
}

/* ****************************************
 *  Save a Favorite Vehicle
 * **************************************** */
async function saveFavorite(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", errors.array()[0].msg);
    return res.redirect("back");
  }

  try {
    const account_id = res.locals.accountData.account_id;
    const inv_id = parseInt(req.body.inv_id);

    // Make sure the vehicle exists
    const vehicle = await invModel.getInventoryById(inv_id);
    if (!vehicle || vehicle.length === 0) {
      req.flash("notice", "Vehicle not found.");
      return res.redirect("back");
    }

    await favoriteModel.saveFavorite(account_id, inv_id);
    req.flash("notice", "Saved to your vehicles.");
    res.redirect("back");
  } catch (err) {
    console.error(err);
    req.flash("notice", "Could not save vehicle.");
    res.redirect("back");
  }
}

/* ****************************************
 *  Remove a Favorite Vehicle
 * **************************************** */
async function removeFavorite(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", errors.array()[0].msg);
    return res.redirect("back");
  }

  try {
    const account_id = res.locals.accountData.account_id;
    const inv_id = parseInt(req.body.inv_id);

    await favoriteModel.removeFavorite(account_id, inv_id);
    req.flash("notice", "Removed from your saved vehicles.");
    res.redirect("back");
  } catch (err) {
    console.error(err);
    req.flash("notice", "Could not remove vehicle.");
    res.redirect("back");
  }
}

/* ****************************************
 *  Export Controller Functions
 * **************************************** */
module.exports = {
  buildFavorites,
  saveFavorite,
  removeFavorite,
  validateSave,
  validateUnsave,
};
