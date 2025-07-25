const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// New: Build vehicle detail view
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    const data = await invModel.getInventoryById(inv_id);
    if (data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, we couldn't find the vehicle you requested.",
        nav: await utilities.getNav(),
      });
    }
    const vehicle = data[0];
    const detailHTML = utilities.buildVehicleDetail(vehicle);
    const nav = await utilities.getNav();
    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detail: detailHTML,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = invCont