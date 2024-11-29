import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-65290-default-rtdb.firebaseio.com/"
}


const app = initializeApp(appSettings)
const database  = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")


addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
  
    push(shoppingListInDB, inputValue)
  
    clearInputFieldEl()
  })

onValue(shoppingListInDB, function(snapshot) {
    
     if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
    
        for (let i =0; i <itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
        
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here...yet"
    }
    
    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    /*newEl.addEventListener("click", function() {
        
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })*/
    
    shoppingListEl.append(newEl)
}

document.addEventListener('DOMContentLoaded', () => {
    const shoppingList = document.getElementById('shopping-list');

    // Reference to the Firebase database (or Firestore)
    const messagesRef = database.ref('messages');  // For Realtime Database

    // Query Firebase for the most recent 10 messages
    messagesRef
        .orderByChild('timestamp')  // Assuming messages have a 'timestamp' field
        .limitToLast(10)  // Only get the last 10 messages
        .on('value', snapshot => {
            const messages = snapshot.val();  // Get the messages from the snapshot

            // Clear previous messages in the list
            shoppingList.innerHTML = '';

            // Render the messages to the UI
            if (messages) {
                Object.values(messages).forEach(msg => {
                    const newItem = document.createElement('li');
                    if (msg.username) {
                        newItem.textContent = `${msg.username}: ${msg.message}`;
                    } else {
                        newItem.textContent = msg.message;
                    }
                    shoppingList.appendChild(newItem);
                });
            }
        });
});

