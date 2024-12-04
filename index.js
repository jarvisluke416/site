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
    
    // Check if the item is a video URL (YouTube, Vimeo, or .mp4 file)
    if (itemValue.includes("youtube.com") || itemValue.includes("vimeo.com") || itemValue.endsWith(".mp4")) {
        
        // Create a container for the video
        let videoContainer = document.createElement("div");
        videoContainer.style.width = "100%"; // Make sure the container spans full width

        // Check if it's a YouTube URL
        if (itemValue.includes("youtube.com")) {
            const youtubeEmbedUrl = itemValue.replace("watch?v=", "embed/");
            let iframe = document.createElement("iframe");
            iframe.setAttribute("src", youtubeEmbedUrl);
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "true");
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "auto");
            videoContainer.appendChild(iframe);
        }
        
        // Check if it's a Vimeo URL
        else if (itemValue.includes("vimeo.com")) {
            const vimeoEmbedUrl = itemValue.replace("vimeo.com", "player.vimeo.com/video");
            let iframe = document.createElement("iframe");
            iframe.setAttribute("src", vimeoEmbedUrl);
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "true");
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "auto");
            videoContainer.appendChild(iframe);
        }
        
        // Check if it's an MP4 URL
        else if (itemValue.endsWith(".mp4")) {
            let videoEl = document.createElement("video");
            videoEl.setAttribute("controls", "true");
            videoEl.setAttribute("width", "100%");
            videoEl.setAttribute("height", "auto");
            videoEl.setAttribute("src", itemValue); // Direct MP4 URL
            videoContainer.appendChild(videoEl);
        }

        // Append the video container to the list item
        newEl.appendChild(videoContainer);
    } else {
        // Otherwise, display it as text (default behavior)
        newEl.textContent = itemValue;
    }

    shoppingListEl.append(newEl);
}
