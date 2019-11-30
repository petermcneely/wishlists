/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
function signin() {
  const body = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange =function() {
    if (this.readyState === 4) {
      if (this.status === 401) {
        showAlert(this.response, this.status);
      } else if (this.status === 200) {
        window.location.href = '/';
      }
    }
  };
  xhttp.open('POST', window.location.href, true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send(JSON.stringify(body));

  return false;
}
