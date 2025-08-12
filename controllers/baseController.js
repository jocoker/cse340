const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
const nav = await utilities.getNav()
  
   res.render("index", {
    title: "Home",
    nav,
    errors: null, // prevent "errors is not defined" crash
    message: req.flash("notice") // also add this if you're using flash messages
  })
}

module.exports = baseController