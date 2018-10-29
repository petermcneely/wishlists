function signup() {
	let body = {
		email: document.getElementById("email").value,
		password: document.getElementById("password").value,
		retypePassword: document.getElementById("retypePassword").value
	};
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange =function () {
		console.log(this.readyState);
		if (this.readyState === 4) {
			console.log(this.status);
			if (this.status === 500) {
				showAlert(JSON.parse(this.response).message, this.status);	
			}
			else if (this.status === 200) {
				window.location.href = '/users/sign-in';
			}
		}
	};
	xhttp.open("POST", window.location.href, true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send(JSON.stringify(body));

	return false;
}