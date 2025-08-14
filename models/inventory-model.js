/*
===============================================
 Inventory Model
 Handles database queries for classifications
 and vehicle inventory management.
===============================================
*/

const pool = require("../database/");

/* ****************************************
 *  Get All Classifications
 * **************************************** */
async function getClassifications() {
  try {
    const sql = `
      SELECT * 
      FROM public.classification 
      ORDER BY classification_name;
    `;
    return await pool.query(sql); // return full result object so .rows works in utilities
  } catch (error) {
    throw new Error("Database error while fetching classifications: " + error.message);
  }
}

/* ****************************************
 *  Get Inventory Items by Classification ID
 * **************************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT * 
      FROM public.inventory AS i
      JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1;
    `;
    const data = await pool.query(sql, [classification_id]);
    return data.rows;
  } catch (error) {
    throw new Error("Database error while fetching inventory by classification: " + error.message);
  }
}

/* ****************************************
 *  Get Inventory Item by ID
 * **************************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT * 
      FROM public.inventory AS i
      JOIN public.classification AS c 
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1;
    `;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    throw new Error("Database error while fetching inventory by ID: " + error.message);
  }
}

/* ****************************************
 *  Add New Classification
 * **************************************** */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name) 
      VALUES ($1);
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount;
  } catch (error) {
    throw new Error("Database error while adding classification: " + error.message);
  }
}

/* ****************************************
 *  Add New Inventory Item
 * **************************************** */
async function addInventory(
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
) {
  try {
    const sql = `
      INSERT INTO inventory
        (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;
    const result = await pool.query(sql, [
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
    ]);
    return result.rowCount;
  } catch (error) {
    throw new Error("Database error while adding inventory: " + error.message);
  }
}

/* ****************************************
 *  Update Inventory Data
 * **************************************** */
async function updateInventory(
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
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET 
        inv_make = $1,
        inv_model = $2,
        inv_description = $3,
        inv_image = $4,
        inv_thumbnail = $5,
        inv_price = $6,
        inv_year = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *;
    `;
    const data = await pool.query(sql, [
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
      inv_id
    ]);
    return data.rows[0];
  } catch (error) {
    throw new Error("Database error while updating inventory: " + error.message);
  }
}

/* ****************************************
 *  Delete Inventory Item
 * **************************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = `
      DELETE FROM inventory 
      WHERE inv_id = $1;
    `;
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    throw new Error("Database error while deleting inventory: " + error.message);
  }
}

/* ****************************************
 *  Export Model Functions
 * **************************************** */
module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById, 
  addClassification,
  addInventory, 
  updateInventory, 
  deleteInventoryItem 
};
