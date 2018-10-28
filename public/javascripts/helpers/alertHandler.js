function showAlert(message, status) {
	var element = document.getElementById("message");
	var messageText = document.getElementById("messageText");
	element.className = "alert";
	if (status == 200) {
		element.className += " alert-success";
	}
	else if (status == 500 || status == 401) {
		element.className += " alert-danger";
	}
	messageText.textContent = message;
}

function removeAlert() {
	var element = document.getElementById("message");
	var messageText = document.getElementById("messageText");
	element.className = "invisible";
	messageText.textContent = "";
}