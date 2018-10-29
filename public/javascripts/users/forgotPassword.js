function forgotPassword() {
	let body = {
		email: document.getElementById("email").value
	};
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange =function () {
		if (this.readyState === 4 && (this.status == 200 || this.status == 500)) {
			showAlert(JSON.parse(this.response).message, this.status);
		}
	};
	xhttp.open("POST", window.location.href, true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send(JSON.stringify(body));

	return false;
}