/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
function update() {
  const body = {
    name: document.getElementById('name').value,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
      showAlert(JSON.parse(this.response).message, this.status);
    }
  };
  xhttp.open('PUT', window.location.href, true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send(JSON.stringify(body));

  return false;
}

function doDelete(occasionSlug) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        window.location.href = '/occasions/' + occasionSlug;
      } else if (this.status == 500 || this.status == 404) {
        document.getElementById('message').textContent = this.responseText;
      }
    }
  };
  xhttp.open('DELETE', window.location.href, true);
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send();

  return false;
}
