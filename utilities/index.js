/*
===============================================
 Utilities Module
 Contains shared functions, HTML builders,
 and authentication/authorization middleware.
===============================================
*/

const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const favoriteModel = require("../models/favorite-model");

const Util = {};

// =====================
// Build Navigation
// =====================
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  data.rows.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}" 
         title="See our inventory of ${row.classification_name} vehicles">
         ${row.classification_name}
      </a>
    </li>`;
  });

  list += "</ul>";
  return list;
};

// =====================
// Build Classification Grid
// =====================
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += `
        <li>
          <a href="/inv/detail/${vehicle.inv_id}" 
             title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" 
                 alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="/inv/detail/${vehicle.inv_id}" 
                 title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                 ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
          </div>
        </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// =====================
// Error Handling Wrapper
// =====================
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// =====================
// Build Vehicle Detail View
// =====================
Util.buildVehicleDetail = async function (vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle information not available.</p>';
  }

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" 
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>
      <div class="vehicle-info">
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
};

// =====================
// Build Classification <select>
// =====================
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications();
  let classificationList = `
    <select name="classification_id" id="classification_id" required>
      <option value="">Choose a Classification</option>`;

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected";
    }
    classificationList += `>${row.classification_name}</option>`;
  });

  classificationList += "</select>";
  return classificationList;
};

// =====================
// JWT Token Check
// =====================
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = true;
        next();
      }
    );
  } else {
    next();
  }
};

// =====================
// Login Check
// =====================
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

// =====================
// Logout Handler
// =====================
const handleLogout = (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/");
};

// =====================
// Role Check (Employee/Admin)
// =====================
Util.checkEmployeeOrAdmin = (req, res, next) => {
  const accountType = res.locals.accountData?.account_type;
  if (accountType === "Employee" || accountType === "Admin") {
    return next();
  }
  req.flash("notice", "Access denied. Admin or Employee only.");
  return res.redirect("/account/login");
};

// =====================
// Check if a Vehicle is Favorited
// =====================
async function markFavoriteState(req, res, inv_id) {
  if (!res.locals.loggedin) return false;
  try {
    const account_id = res.locals.accountData.account_id;
    return await favoriteModel.isFavorite(account_id, inv_id);
  } catch {
    return false;
  }
}

// =====================
// Module Exports
// =====================
module.exports = {
  ...Util,
  handleLogout,
  markFavoriteState,
};
