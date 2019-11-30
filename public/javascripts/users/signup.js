/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
function signup() {
  const body = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    retypePassword: document.getElementById('retypePassword').value,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && (this.status === 200 || this.status === 500)) {
      showAlert(JSON.parse(this.response).message, this.status);
    }
  };
  xhttp.open('POST', window.location.href, true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send(JSON.stringify(body));

  return false;
}
