/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
function cancel() {
  window.location.href = '/occasions';
}

function create() {
  const body = {
    name: document.getElementById('name').value,
    occurrence: document.getElementById('occurrence').value,
  };

  if (body.name.trim() === '') {
    showAlert('The occasion name cannot be blank.', 500);
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status === 200) {
          window.location.href = '/occasions';
        } else {
          showAlert(JSON.parse(this.response).message, this.status);
        }
      }
    };
    xhttp.open('POST', window.location.href, true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhttp.setRequestHeader('X-CSRF-TOKEN',
        document.getElementById('_csrf').value);
    xhttp.send(JSON.stringify(body));
  }

  return false;
}
