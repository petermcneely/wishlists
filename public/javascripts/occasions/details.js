(function () {
	$('#shareModal').on('hide.bs.moal', function (e) {
		document.getElementById('recipientList').removeChildren();
	});
})();

function update() {
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
	xhttp.open("PUT", window.location.href, true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send(JSON.stringify(body));

	return false;
}

function doDelete() {
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
	xhttp.open("DELETE", window.location.href, true);
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send();

	return false;
}

function addRecipient() {
	var email = document.getElementById("email").value;
	document.getElementById("email").value = "";

	var recipientList = document.getElementById("recipientList");

	var emailCell = document.createElement("td");
	emailCell.appendChild(document.createTextNode(email));

	var newChip = document.createElement("div");
	newChip.classList.add("chip");
	newChip.appendChild(document.createTextNode(email));
	var closeSpan = document.createElement("span");
	closeSpan.textContent = "x";
	closeSpan.classList.add("closebtn");
	closeSpan.setAttribute("id", "item" + recipientList.children.length);
	closeSpan.setAttribute("onclick", "remove('item" + recipientList.children.length + "')");
	newChip.appendChild(closeSpan);
	recipientList.appendChild(newChip);

	return false;
}

function remove(index) {
	var itemToRemove = document.getElementById(index);
	itemToRemove.parentNode.parentNode.removeChild(itemToRemove.parentNode);
}

function gatherEmails() {
	var recipientList = document.getElementById('recipientList');
	var recipients = recipientList.children;
	var emails = [];
	for (var i = 0, j = 0; i < recipients.length; j++) {
		emails[j] = recipients[i].firstChild.textContent;
		recipients[i].parentNode.removeChild(recipients[i]);
	}
	return emails;
}

function sendEmails(emails) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {

			if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
				showAlert(JSON.parse(this.response).message, this.status);
			}
		}
	};
	xhttp.open("POST", window.location.href + "/share", true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.setRequestHeader("X-CSRF-TOKEN", document.getElementById("_csrf").value);
	xhttp.send(JSON.stringify({emails: emails}));
}

function ok()
{
	$('#shareModal').modal('hide');
	sendEmails(gatherEmails());
}