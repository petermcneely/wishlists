(function () {
	var dates = document.getElementsByClassName("date");
	Array.prototype.forEach.call(dates, function (element) {
		var date = new Date(element.textContent !== "" ? element.textContent : element.defaultValue);
		var padZero = function (number) {
			number = number + 1;
			return number < 10 ? "0" + number : number;
		};

		var formattedDate = date.getUTCFullYear() + "-" + padZero(date.getUTCMonth()) + "-" + padZero(date.getUTCDate());

		if (element.textContent !== "")
		{
			element.textContent = formattedDate;
		}
		else
		{
			element.defaultValue = formattedDate;
		}
	});
})();