const jwt = require("jsonwebtoken")
require("dotenv").config()

const checkLogin = (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (token) {
      // Verify token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
        if (err) {
          res.locals.loggedin = false
          return next()
        }
        res.locals.loggedin = true
        res.locals.accountData = accountData // make account info available in views
        return next()
      })
    } else {
      res.locals.loggedin = false
      return next()
    }
  } catch (error) {
    res.locals.loggedin = false
    return next()
  }
}

module.exports = checkLogin
