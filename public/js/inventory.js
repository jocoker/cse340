/*
===============================================
 Inventory Management Page Script
 Fetches inventory by classification and
 builds the table dynamically.
===============================================
*/

// Get a list of items in inventory based on the classification_id
const classificationList = document.querySelector("#classification_id");

if (classificationList) {
  classificationList.addEventListener("change", () => {
    const classification_id = classificationList.value;
    const classIdURL = "/inv/getInventory/" + classification_id;

    fetch(classIdURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error("Network response was not OK");
      })
      .then((data) => {
        buildInventoryList(data);
      })
      .catch((error) => {
        console.error("There was a problem: ", error.message);
      });
  });
}

/**
 * Build inventory items into HTML table components and inject into DOM
 */
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  // Set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";

  // Set up the table body
  dataTable += "<tbody>";
  data.forEach((element) => {
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";

  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}
