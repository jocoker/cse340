const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// =====================
// Public Routes
// =====================
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// =====================
// Admin/Employee Routes
// =====================

// Management view
router.get("/", 
  utilities.checkLogin, 
  utilities.checkEmployeeOrAdmin, 
  utilities.handleErrors(invController.buildManagement)
)

// Add classification
router.get("/add-classification", 
  utilities.checkLogin, 
  utilities.checkEmployeeOrAdmin, 
  utilities.handleErrors(invController.buildAddClassification)
)

router.post("/add-classification", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory
router.get("/add-inventory", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post("/add-inventory", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory
router.get("/edit/:inv_id", 
  utilities.checkLogin, 
  utilities.checkEmployeeOrAdmin, 
  utilities.handleErrors(invController.editInventoryView)
)

router.post("/update", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete inventory
router.get("/delete/:inv_id", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

router.post("/delete", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)

// API route for dynamic dropdowns (can stay public or restrict as needed)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Optional: Error test route
router.get("/error-test", utilities.handleErrors((req, res, next) => {
  throw new Error("Intentional Server Error for Testing Purposes")
}))

module.exports = router
