function update(id) {
	var body = {
		name: document.getElementById("name").value,
		occurrence: document.getElementById("occurrence").value
	};
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
			showAlert(JSON.parse(this.response).message, this.status);
		}
	};
	xhttp.open("PUT", "/occasions/" + id, true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send(JSON.stringify(body));

	return false;
}

function doDelete(id) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				window.location.replace("/occasions");
			}
			else if (this.status == 500 || this.status == 404) {
				document.getElementById("message").textContent = this.responseText;	
			}
		}
	};
	xhttp.open("DELETE", "/occasions/" + id, true);
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send();

	return false;
}

function showAlert(message, status) {
	var element = document.getElementById("message");
	var messageText = document.getElementById("messageText");
	element.className = "alert";
	if (status == 200) {
		element.className += " alert-success";
	}
	else if (status == 500) {
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