function update() {
	var body = {
		name: document.getElementById("name").value,
		comments: document.getElementById("comments").value,
		link: document.getElementById("link").value
	};
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
			showAlert(JSON.parse(this.response).message, this.status);
		}
	};
	xhttp.open("PUT", window.location.href, true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send(JSON.stringify(body));

	return false;
}

function doDelete(occasionId, wishlistId) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				window.location.replace("/occasions/" + occasionId + "/wishlists/" + wishlistId);
			}
			else if (this.status == 500 || this.status == 404) {
				document.getElementById("message").textContent = this.responseText;	
			}
		}
	};
	xhttp.open("DELETE", window.location.href, true);
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send();

	return false;
}