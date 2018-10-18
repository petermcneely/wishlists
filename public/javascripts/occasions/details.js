function update(id) {
		var body = {
			name: document.getElementById("name").value,
			occurrence: document.getElementById("occurrence").value
		};
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("message").innerHTML = this.responseText;
				return false;
			}
		};
		xhttp.open("PUT", "/occasions/" + id, true);
		xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
		xhttp.send(JSON.stringify(body));

		return false;
	}