(function() {
  const dates = document.getElementsByClassName('date');
  Array.prototype.forEach.call(dates, function(element) {
    const date = new Date(
        element.textContent !== '' ?
        element.textContent : element.defaultValue);
    const padZero = function(number) {
      number = number;
      return number < 10 ? '0' + number : number;
    };

    const formattedDate = date.getUTCFullYear() +
    '-' + padZero(date.getUTCMonth() + 1) + '-' + padZero(date.getUTCDate());

    if (element.textContent !== '') {
      element.textContent = formattedDate;
    } else {
      element.defaultValue = formattedDate;
    }
  });
})();
