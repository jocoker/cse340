/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require('./utilities/index')
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")
const favoriteRoute = require("./routes/favoriteRoute")

/* ***********************
 * Middleware
 *************************/
// Parse cookies before checking JWT
app.use(cookieParser())

// Decode JWT token and set res.locals
app.use(utilities.checkJWTToken)

// Make login data available to all views
app.use((req, res, next) => {
  res.locals.loggedin = res.locals.loggedin || false
  res.locals.accountData = res.locals.accountData || null
  next()
})


// Session management
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

// Flash message middleware
app.use(flash())

// Parse request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // Not at views root

/* ***********************
 * Routes
 *************************/
app.use(static) // CSS, client JS, images

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory route
app.use("/inv", inventoryRoute)

// Account route
app.use("/account", accountRoute)


app.use("/", favoriteRoute)


/* ***********************
 * Express Error Handling
 *************************/
// 404 - Not Found
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

// 500 - Server Error
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const status = err.status || 500
  const title = status === 404 ? "Page Not Found" : "Server Error"
  const message =
    status === 404
      ? "Sorry, we couldn't find the page you're looking for."
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(status).render("errors/error", {
    title,
    message,
    nav,
    status,
  })
})

/* ***********************
 * Local Server Info
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Startup
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
