import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://users-5cafc-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database  = getDatabase(app)
const userListInDB = ref(database, "userList") 

const userInputEl = document.getElementById("user-input")
const addUserButtonEl = document.getElementById("add-user-button")
const userListEl = document.getElementById("user-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = userInputEl.value
  
    push(userListInDB, inputValue)
  
    clearInputFieldEl()
  })

onValue(userListInDB, function(snapshot) {
    
     if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearUserListEl()
    
        for (let i =0; i <itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
        
            appendItemToUserListEl(currentItem)
        }
    } else {
        userListEl.innerHTML = "No items here...yet"
    }
    
    
})

function clearUserListEl() {
    userListEl.innerHTML = ""
}

function userInputFieldEl() {
    userInputEl.value = ""
}

function appendItemToUserListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.addEventListener("click", function() {
       
        let exactLocationOfItemInDB = ref(database, `userList/${itemID}`)
       
        remove(exactLocationOfItemInDB)
    })
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        
        let exactLocationOfItemInDB = ref(database, `userList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })   
    
    userListEl.append(newEl)
}
