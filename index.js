import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Initialize Firebase
const appSettings = {
  databaseURL: "https://realtime-database-65290-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);

// Reference to the comments node in Firebase
const commentsRef = ref(database, "comments");

// Get the input fields and button
const nameInput = document.getElementById("input-name");
const commentInput = document.getElementById("input-comment");
const submitButton = document.getElementById("submit-comment");
const commentsList = document.getElementById("comments-list");

// Listen for submit button click to add a comment
submitButton.addEventListener("click", function() {
  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  // Only submit if both fields are filled
  if (name && comment) {
    const newComment = {
      name: name,
      comment: comment
    };

    // Push the new comment to Firebase
    push(commentsRef, newComment);

    // Clear the input fields
    nameInput.value = "";
    commentInput.value = "";
  } else {
    alert("Please enter both name and comment!");
  }
});

// Listen for changes to the comments in Firebase
onValue(commentsRef, function(snapshot) {
  commentsList.innerHTML = ""; // Clear the existing comments
  if (snapshot.exists()) {
    const comments = snapshot.val();
    for (const id in comments) {
      const comment = comments[id];
      const commentItem = document.createElement("li");
      commentItem.textContent = `${comment.name}: ${comment.comment}`;

      // Add a delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function() {
        remove(ref(database, `comments/${id}`));  // Remove from Firebase
      });

      commentItem.appendChild(deleteButton);
      commentsList.appendChild(commentItem);
    }
  } else {
    commentsList.innerHTML = "No comments yet.";
  }
});
