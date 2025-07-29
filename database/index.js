const { Pool } = require("pg")
require("dotenv").config()

// Determine SSL settings based on environment
const isDev = process.env.NODE_ENV === "development"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isDev ? false : { rejectUnauthorized: false },
})

// Unified export with query logging
const db = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params)
      if (isDev) {
        console.log("executed query", { text })
      }
      return res
    } catch (error) {
      console.error("error in query", { text, error })
      throw error
    }
  },
}

module.exports = db
