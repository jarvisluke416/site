import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-65290-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
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
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");

    // Check if the item is a video URL
    let videoEl;
    if (isVideoUrl(itemValue)) {
        videoEl = document.createElement("iframe");
        videoEl.setAttribute("frameborder", "0");
        videoEl.setAttribute("allowfullscreen", "true");
        videoEl.setAttribute("width", "100%");
        videoEl.setAttribute("height", "auto");

        // Extract the appropriate video embed URL
        let videoEmbedUrl = getVideoEmbedUrl(itemValue);

        if (videoEmbedUrl) {
            videoEl.setAttribute("src", videoEmbedUrl);
            newEl.appendChild(videoEl);
        } else {
            newEl.textContent = itemValue;
        }
    } else {
        newEl.textContent = itemValue;
    }

    // Create a delete button for each item
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    newEl.appendChild(deleteButton);
    shoppingListEl.append(newEl);
}

// Expanded list of video platforms
function isVideoUrl(url) {
    const videoHosts = [
        'chaturbate.com', 'cbxyz.com', // Chaturbate
        'youtube.com', 'youtu.be',     // YouTube
        'vimeo.com',                   // Vimeo
        'dailymotion.com', 'dai.ly',   // Dailymotion
        'twitch.tv',                   // Twitch
        'metacafe.com',                // Metacafe
        'break.com',                   // Break
        'veoh.com',                    // Veoh
        'rutube.ru',                   // Rutube
        'ted.com',                     // TED Talks
        'player.vimeo.com',            // Vimeo Player
        'streamable.com',              // Streamable
        'vidyard.com',                 // Vidyard
        'wistia.com',                  // Wistia
        'brightcove.com'               // Brightcove
    ];

    return videoHosts.some(host => url.includes(host));
}

// Enhanced embed URL extraction
function getVideoEmbedUrl(url) {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = extractYouTubeId(url);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    // Vimeo
    if (url.includes("vimeo.com")) {
        let videoId = extractVimeoId(url);
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    
    // Dailymotion
    if (url.includes("dailymotion.com") || url.includes("dai.ly")) {
        let videoId = extractDailymotionId(url);
        return videoId ? `https://www.dailymotion.com/embed/video/${videoId}` : null;
    }
    
    // Twitch
    if (url.includes("twitch.tv")) {
        let videoId = extractTwitchId(url);
        return videoId ? `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}` : null;
    }
    
    // Generic fallback for other platforms
    return null;
}

// Existing extraction functions
function extractYouTubeId(url) {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match && match[1];
}

function extractVimeoId(url) {
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const match = url.match(vimeoRegex);
    return match && match[1];
}

function extractDailymotionId(url) {
    const dailymotionRegex = /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(dailymotionRegex);
    return match ? match[1] : null;
}

// New extraction function for Twitch
function extractTwitchId(url) {
    const twitchRegex = /(?:twitch\.tv\/videos\/|twitch\.tv\/)(\d+)/;
    const match = url.match(twitchRegex);
    return match && match[1];
}
