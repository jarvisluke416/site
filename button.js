  document.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('input-field');
  const addButton = document.getElementById('add-button');
  const shoppingList = document.getElementById('shopping-list');

  // Function to add item to the shopping list
  function addItemToList() {
    const text = inputField.value.trim();
    if (text !== '') {
      const newItem = document.createElement('li');
      newItem.textContent = text;
      shoppingList.appendChild(newItem);
      inputField.value = ''; // Clear the input field after adding
    }
  }

  // Add event listener for the button click
  addButton.addEventListener('click', addItemToList);

  // Add event listener for the Enter key (Return key)
  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addItemToList();
    }
  });
});

