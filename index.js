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

// Updated appendItemToShoppingListEl function to handle videos
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    
    // Check if the item is a video URL (You can adjust this for specific platforms like YouTube or Vimeo)
    if (itemValue.includes("youtube.com") || itemValue.includes("vimeo.com") || itemValue.endsWith(".mp4")) {
        // Create a video element
        let videoEl = document.createElement("video");
        videoEl.setAttribute("controls", "true");
        videoEl.setAttribute("width", "100%");
        videoEl.setAttribute("height", "auto");
        
        // Check if the video URL is an MP4 or embed URL
        if (itemValue.endsWith(".mp4")) {
            videoEl.setAttribute("src", itemValue); // Direct video URL
        } else {
            // For YouTube/Vimeo, you can use an iframe or similar approach
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
        // Otherwise, display it as text (default behavior)
        newEl.textContent = itemValue;
    }

    shoppingListEl.append(newEl);
}
