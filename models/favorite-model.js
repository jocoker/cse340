const pool = require("../database/")

/* ***************************
 * Save a vehicle to favorites
 * *************************** */
async function saveFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorite (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING *;
  `
  try {
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0] || null // null if it already existed
  } catch (error) {
    console.error("error in query", { text: sql, error })
    throw error
  }
}

/* ***************************
 * Remove a vehicle from favorites
 * *************************** */
async function removeFavorite(account_id, inv_id) {
  const sql = `DELETE FROM favorite WHERE account_id = $1 AND inv_id = $2 RETURNING *;`
  try {
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("error in query", { text: sql, error })
    throw error
  }
}

/* ***************************
 * List all favorites for a user
 * *************************** */
async function listFavoritesByAccount(account_id) {
  const sql = `
    SELECT f.favorite_id, f.created_at,
           i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail
    FROM favorite f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC;
  `
  try {
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("error in query", { text: sql, error })
    throw error
  }
}

/* ***************************
 * Check if a specific vehicle is a favorite
 * *************************** */
async function isFavorite(account_id, inv_id) {
  const sql = `SELECT 1 FROM favorite WHERE account_id = $1 AND inv_id = $2;`
  try {
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("error in query", { text: sql, error })
    throw error
  }
}

module.exports = { saveFavorite, removeFavorite, listFavoritesByAccount, isFavorite }
