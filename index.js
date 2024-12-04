import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-65290-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database  = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
});

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        clearShoppingListEl();
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "No items here...yet";
    }
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]; // Item ID from Firebase
    let itemValue = item[1]; // Item content (message or video URL)
    
    let newEl = document.createElement("li");

    // Check if the item is a video URL or a regular message
    if (itemValue.includes("youtube.com") || itemValue.includes("vimeo.com") || itemValue.endsWith(".mp4")) {
        let videoEl = document.createElement("video");
        videoEl.setAttribute("controls", "true");
        videoEl.setAttribute("width", "100%");
        videoEl.setAttribute("height", "auto");
        
        if (itemValue.endsWith(".mp4")) {
            videoEl.setAttribute("src", itemValue); 
        } else {
            let iframe = document.createElement("iframe");
            iframe.setAttribute("src", itemValue);
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "true");
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "auto");
            newEl.appendChild(iframe);
        }

        newEl.appendChild(videoEl);
    } else {
        newEl.textContent = itemValue;
    }

    // Create a delete button for each item
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        // Reference the item in the Firebase database and remove it
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    newEl.appendChild(deleteButton);
    shoppingListEl.append(newEl);
}

