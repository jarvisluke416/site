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
