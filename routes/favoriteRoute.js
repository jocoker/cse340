const express = require("express")
const router = new express.Router()
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities")

// View favorites list (must be logged in)
router.get(
  "/account/favorites",
  utilities.checkLogin, // JWT-based middleware
  favoriteController.buildFavorites
)

// Save a vehicle to favorites
router.post(
  "/favorite",
  utilities.checkLogin,
  favoriteController.validateSave,
  utilities.handleErrors(favoriteController.saveFavorite)
)

// Remove a vehicle from favorites
router.post(
  "/favorite/remove",
  utilities.checkLogin,
  favoriteController.validateUnsave,
  utilities.handleErrors(favoriteController.removeFavorite)
)

module.exports = router
