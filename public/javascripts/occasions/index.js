function doDelete(id) {
	console.log("in do delete");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var element = document.getElementById(id);
			element.parentNode.removeChild(element);
		}
	};
	xhttp.open("DELETE", "/occasions/" + id, true);
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send();
}