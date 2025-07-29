const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required by Render
  },
})

const db = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params)
      if (process.env.NODE_ENV === "development") {
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
