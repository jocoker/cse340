/*
===============================================
 Favorite Routes
 Handles viewing, adding, and removing
 favorite vehicles for logged-in users.
===============================================
*/

const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const utilities = require("../utilities");

/* ***************
 *  GET Routes
 * *************** */

// View favorites list (must be logged in)
router.get(
  "/account/favorites",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.buildFavorites)
);

/* ***************
 *  POST Routes
 * *************** */

// Save a vehicle to favorites
router.post(
  "/favorite",
  utilities.checkLogin,
  favoriteController.validateSave,
  utilities.handleErrors(favoriteController.saveFavorite)
);

// Remove a vehicle from favorites
router.post(
  "/favorite/remove",
  utilities.checkLogin,
  favoriteController.validateUnsave,
  utilities.handleErrors(favoriteController.removeFavorite)
);

module.exports = router;
