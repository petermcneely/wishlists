'use strict'

module.exports = function (password) {
	let lengthRequirement = 8;

	if (!password || password.length < lengthRequirement) {
		return "Password needs to be at least eight characters long.";
	}

	let rules = [
		{
			pattern: RegExp(/\d/),
			message: "Password needs to have at least one number."
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