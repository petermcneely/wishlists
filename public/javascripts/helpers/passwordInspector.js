function inspectPassword() {
	let currentPassword = document.getElementById("password").value;
	let checkPassword = function (password) {
		let lengthRequirement = 8;

		if (!password || password.length < lengthRequirement) {
			return "Password needs to be at least eight characters long.";
		}

		let rules = [
			{
				pattern: RegExp(/\d/),
				message: "Pasword needs to have at least one number."
			},
			{
				pattern: RegExp(/[a-z]/),
				message: "Password needs to have at least one lower case letter."
			},
			{
				pattern: RegExp(/[A-Z]/),
				message: "Password needs to have at least one upper case letter."
			}
		];

		for (var i = 0; i < rules.length; ++i) {
			if (!rules[i].pattern.test(password)) {
				return rules[i].message;
			}				
		}

		return null;
	}

	document.getElementById("passwordError").textContent = checkPassword(document.getElementById("password").value);
	inspectRetype();
}

function inspectRetype() {
	let errorElement = document.getElementById("retypePasswordError");
	if (document.getElementById("password").value !== document.getElementById("retypePassword").value) {
		errorElement.textContent = "Password does not match.";
	}
	else {
		errorElement.textContent = null;
	}
}