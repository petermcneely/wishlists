function cancel(occasionSlug) {
	window.location.href = '/occasions/' + occasionSlug;
}

function create(occasionSlug) {
	let body = {
		name: document.getElementById("name").value
	};

	if (body.name.trim() === "") {
		showAlert("The wishlist name cannot be blank.", 500);
	}
	else {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status === 200) {
					window.location.href = '/occasions/' + occasionSlug;
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