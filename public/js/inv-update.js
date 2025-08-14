/*
===============================================
 Inventory Update Page Script
 Enables the submit button only when 
 the form has been changed.
===============================================
*/

// Grab the update form by ID
const form = document.querySelector("#updateForm");

if (form) {
  // When any field changes, enable the submit button
  form.addEventListener("change", () => {
    const updateBtn = form.querySelector("button, input[type='submit']");
    if (updateBtn) {
      updateBtn.removeAttribute("disabled");
    }
  });
}
