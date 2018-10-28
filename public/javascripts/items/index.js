function claim(id) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
			showAlert(JSON.parse(this.response).message, this.status);
			var actionButton = document.getElementById("actionButton");
			actionButton.classList.remove("btn-success");
			actionButton.classList.add("btn-danger");
			actionButton.setAttribute("onclick", "unclaim('" + id + "')");
			actionButton.textContent = "Unclaim";
			document.getElementById("status").textContent = "Claimed";
		}
	};
	xhttp.open("PUT", window.location.href + "/items/" + id + "/claim", true);
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send();
}

function unclaim(id) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
			showAlert(JSON.parse(this.response).message, this.status);
			var actionButton = document.getElementById("actionButton");
			actionButton.classList.remove("btn-danger");
			actionButton.classList.add("btn-success");
			actionButton.setAttribute("onclick", "claim('" + id + "')");
			actionButton.textContent = "Claim";
			document.getElementById("status").textContent = "Unclaimed";
		}
	};
	xhttp.open("PUT", window.location.href + "/items/" + id + "/unclaim", true);
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send();
}