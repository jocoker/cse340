/*
===============================================
 Inventory Controller
 Handles vehicle inventory: listing, details,
 management, adding, editing, and deleting.
===============================================
*/

const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ****************************************
 *  Build Inventory by Classification View
 * **************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render("inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  });
};

/* ****************************************
 *  Build Vehicle Detail View
 * **************************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    const data = await invModel.getInventoryById(inv_id);

    if (!data || data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        message: "Sorry, we couldn't find the vehicle you requested.",
        nav: await utilities.getNav(),
      });
    }

    const nav = await utilities.getNav();
    const isFav = res.locals.loggedin
      ? await utilities.markFavoriteState(req, res, inv_id)
      : false;

    res.render("inventory/detail", {
      title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
      nav,
      vehicle: data[0],
      isFavorite: isFav,
      message: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Build Inventory Management View
 * **************************************** */
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    message: req.flash("notice"),
  });
};

/* ****************************************
 *  Build Add Classification View
 * **************************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("notice"),
  });
};

/* ****************************************
 *  Process Add Classification
 * **************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("notice", `Successfully added classification: ${classification_name}`);
    nav = await utilities.getNav(); // Rebuild nav with new classification
    const classificationSelect = await utilities.buildClassificationList();
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      message: req.flash("notice"),
    });
  } else {
    req.flash("notice", "Failed to add classification.");
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  }
};

/* ****************************************
 *  Build Add Inventory View
 * **************************************** */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
    errors: null,
    message: req.flash("notice"),
  });
};

/* ****************************************
 *  Process Add Inventory
 * **************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (result) {
    req.flash("notice", `Successfully added ${inv_year} ${inv_make} ${inv_model}.`);
    nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      message: req.flash("notice"),
    });
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Failed to add vehicle.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      message: req.flash("notice"),
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  }
};

/* ****************************************
 *  Return Inventory by Classification as JSON
 * **************************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);

  if (invData[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ****************************************
 *  Build Edit Inventory View
 * **************************************** */
invCont.editInventoryView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();

  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id);
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    message: req.flash("notice"),
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  });
};

/* ****************************************
 *  Process Update Inventory
 * **************************************** */
invCont.updateInventory = async function (req, res) {
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
  } = req.body;

  const updateResult = await invModel.updateInventory(
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
    classification_id
  );

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
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
      classification_id,
    });
  }
};

/* ****************************************
 *  Build Delete Confirmation View
 * **************************************** */
invCont.buildDeleteInventoryView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();

  const itemData = await invModel.getInventoryById(inv_id);

  if (!itemData || itemData.length === 0) {
    req.flash("notice", "Inventory item not found.");
    return res.redirect("/inv/");
  }

  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    message: req.flash("notice"),
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  });
};

/* ****************************************
 *  Process Delete Inventory
 * **************************************** */
invCont.deleteInventory = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult.rowCount) {
    req.flash("notice", "Vehicle successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
};

/* ****************************************
 *  Export Controller
 * **************************************** */
module.exports = invCont;
