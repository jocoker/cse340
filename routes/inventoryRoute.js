// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

router.get("/error-test", utilities.handleErrors((req, res, next) => {
  throw new Error("Intentional Server Error for Testing Purposes")
}))

module.exports = router;