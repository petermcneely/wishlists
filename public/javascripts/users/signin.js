function signin() {
	let body = {
		email: document.getElementById("email").value,
		password: document.getElementById("password").value
	};
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange =function () {
		if (this.readyState === 4 && this.status === 401) {
			showAlert("Invalid username or password.", this.status);
		}
	};
	xhttp.open("POST", window.location.href, true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send(JSON.stringify(body));

	return false;
}