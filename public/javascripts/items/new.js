function cancel(occasionSlug, wishlistSlug) {
	window.location.href = '/occasions/' + occasionSlug + '/wishlists/' + wishlistSlug;
}

function create(occasionSlug, wishlistSlug) {
	var body = {
		name: document.getElementById("name").value,
		comments: document.getElementById("comments").value,
		link: document.getElementById("link").value
	};

	if (body.name.trim() === "") {
		showAlert("The item name cannot be blank.", 500);
	}
	else {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status === 200) {
					window.location.href = '/occasions/' + occasionSlug + '/wishlists/' + wishlistSlug;
				}
				else {
					showAlert(JSON.parse(this.response).message, this.status);
				}
			}
		};
		xhttp.open("POST", window.location.href, true);
		xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
		xhttp.send(JSON.stringify(body));
	}

	return false;
}