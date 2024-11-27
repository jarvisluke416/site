import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-65290-default-rtdb.firebaseio.com/"
}


const app = initializeApp(appSettings)
const database  = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("username")
const addButtonEl = document.getElementById("listbutton")
const shoppingListEl = document.getElementById("userList")

function addUser() {
    var userName = document.getElementById('username').value;
    if (userName === '') {
        alert('Please enter a name');
        return;
    }

    var userList = document.getElementById('userList');
    var listItem = document.createElement('li');
    listItem.textContent = userName;
    userList.appendChild(listItem);

    document.getElementById('username').value = ''; // Clear input field
}
