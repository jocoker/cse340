
const utilities = require("../utilities/");

/* ****************************************
*  Deliver login view
* **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("message"), // ✅ add this line
  });
}


module.exports = { buildLogin };