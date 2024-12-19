import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase Configuration
const appSettings = {
    databaseURL: "https://realtime-database-65290-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

// Reference to the comments in Firebase
const commentsRef = ref(database, "comments");

// Elements from the page
const nameInput = document.getElementById("input-name");
const commentInput = document.getElementById("input-comment");
const addCommentButton = document.getElementById("add-comment-button");
const commentsList = document.getElementById("comments-list");

// Event listener for the Post Comment button
addCommentButton.addEventListener("click", function() {
    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (name && comment) {
        // Create a new comment object
        const newComment = {
            name: name,
            comment: comment
        };

        // Push new comment to Firebase
        push(commentsRef, newComment)
            .then(() => {
                console.log("Comment added successfully!");
                // Clear input fields
                nameInput.value = '';
                commentInput.value = '';
            })
            .catch((error) => {
                console.error("Error adding comment to Firebase:", error);
            });
    } else {
        alert("Please fill out both the name and comment fields.");
    }
});

// Fetch and display comments from Firebase
onValue(commentsRef, (snapshot) => {
    commentsList.innerHTML = ""; // Clear existing comments
    const comments = snapshot.val();

    if (comments) {
        const commentsArray = Object.entries(comments);
        commentsArray.forEach(([id, commentData]) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${commentData.name}:</strong> ${commentData.comment}`;
            commentsList.appendChild(listItem);
        });
    } else {
        commentsList.innerHTML = "No comments yet.";
    }
});
