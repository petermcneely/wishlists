/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
function updatePassword() {
  const body = {
    currentPassword: document.getElementById('currentPassword').value,
    newPassword: document.getElementById('newPassword').value,
    retypePassword: document.getElementById('retypePassword').value,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange =function() {
    if (this.readyState === 4 && (this.status === 200 || this.status === 500)) {
      showAlert(JSON.parse(this.response).message, this.status);
    }
  };
  xhttp.open('POST', '/users/change-password', true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send(JSON.stringify(body));
  return false;
}

function updateEmail() {
  const body = {
    newEmail: document.getElementById('newEmail').value,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && (this.status === 200 || this.status === 500)) {
      showAlert(JSON.parse(this.response).message, this.status);
    }
  };
  xhttp.open('PUT', '/users/change-email', true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send(JSON.stringify(body));
  return false;
}
