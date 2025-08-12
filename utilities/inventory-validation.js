const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Classification name must be alphanumeric with no spaces or special characters.")
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  const nav = await require("../utilities").getNav()
  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Valid price is required."),
    body("inv_year").isInt({ min: 1885 }).withMessage("Valid year is required."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be 0 or more."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
    body("classification_id").isInt().withMessage("Classification is required.")
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await require("../utilities").getNav()
  const classificationSelect = await require("../utilities").buildClassificationList(req.body.classification_id)
  if (!errors.isEmpty()) {
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors,
      message: req.flash("notice"),
      ...req.body
    })
    return
  }
  next()
}

/* ***************************
 * Check Update Inventory Data
 * Redirects to edit view on error
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const utilities = require("../utilities")
  const nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  if (!errors.isEmpty()) {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make || ""} ${inv_model || ""}`.trim() || "Vehicle"

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors,
      message: req.flash("notice"),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }

  next()
}




module.exports = validate
