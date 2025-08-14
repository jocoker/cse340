/*
===============================================
 Account Model
 Handles database queries for account data.
===============================================
*/

const pool = require("../database/");

/* ****************************************
 *  Register New Account
 * **************************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES 
        ($1, $2, $3, $4, 'Client') 
      RETURNING *;
    `;
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    throw new Error("Database error during account registration: " + error.message);
  }
}

/* ****************************************
 *  Check if Email Already Exists
 * **************************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    throw new Error("Database error during email check: " + error.message);
  }
}

/* ****************************************
 *  Get Account by Email
 * **************************************** */
async function getAccountByEmail(account_email) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname,
           account_email, account_type, account_password
    FROM account
    WHERE account_email = $1;
  `;
  const result = await pool.query(sql, [account_email]);
  return result.rows[0] || null;
}

/* ****************************************
 *  Update Account Info
 * **************************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `;
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return data.rows[0];
  } catch (error) {
    throw new Error("Database error during account update: " + error.message);
  }
}

/* ****************************************
 *  Update Password
 * **************************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `;
    const data = await pool.query(sql, [hashedPassword, account_id]);
    return data.rows[0];
  } catch (error) {
    throw new Error("Database error during password update: " + error.message);
  }
}

/* ****************************************
 *  Get Account by ID
 * **************************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error during account lookup: " + error.message);
  }
}

/* ****************************************
 *  Export Model Functions
 * **************************************** */
module.exports = {
  registerAccount,
  checkExistingEmail, // Added to exports for consistency
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};
