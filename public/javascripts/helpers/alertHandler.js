/* eslint-disable no-unused-vars */
/**
 * @param {string} message The message to show
 * @param {string} status The http status that directs whether this is
 * a success or danger
 */
function showAlert(message, status) {
  const element = document.getElementById('message');
  const messageText = document.getElementById('messageText');
  element.className = 'alert';
  if (status == 200) {
    element.className += ' alert-success';
  } else if (status == 500 || status == 401) {
    element.className += ' alert-danger';
  }
  messageText.textContent = message;
}

/**
 * Removes the alert
 */
function removeAlert() {
  const element = document.getElementById('message');
  const messageText = document.getElementById('messageText');
  element.className = 'invisible';
  messageText.textContent = '';
}
