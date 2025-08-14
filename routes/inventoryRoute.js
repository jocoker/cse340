/*
===============================================
 Inventory Routes
 Handles public inventory views and 
 admin/employee management actions.
===============================================
*/

const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

/* ***************
 *  Public Routes
 * *************** */

// View inventory by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// View vehicle detail
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

// API route for dynamic dropdowns
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ***************
 *  Admin / Employee Routes
 * *************** */

// Management dashboard
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
);

// Add classification (view)
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

// Add classification (process)
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory (view)
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

// Add inventory (process)
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Edit inventory (view)
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
);

// Update inventory (process)
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete inventory (view)
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
);

// Delete inventory (process)
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
);

/* ***************
 *  Utility / Test
 * *************** */

// Error test route
router.get(
  "/error-test",
  utilities.handleErrors((req, res, next) => {
    throw new Error("Intentional Server Error for Testing Purposes");
  })
);

module.exports = router;
