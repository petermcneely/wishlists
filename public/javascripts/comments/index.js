/* eslint-disable no-unused-vars */
/**
 * Creates a comment
 */
function newComment() {
  $('#createModal').modal('hide');
  const body = {
    body: document.getElementById('create-body').value,
    showOwner: document.getElementById('create-show-owner').value,
  };

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        location.reload();
      } else if (this.status == 500 || this.status == 404) {
        document.getElementById('message').textContent = this.responseText;
      }
    }
  };
  xhttp.open('POST', `${window.location.href}/comments/new`, true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send(JSON.stringify(body));
}

/**
 * Updates an comment
 * @param {string} commentOid unique identifier of the comment
 */
function updateComment(commentOid) {
  const body = {
    body: document.getElementById('update-body').value,
    showOwner: document.getElementById('update-show-owner').value,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
      showAlert(JSON.parse(this.response).message, this.status);
    }
  };
  xhttp.open('PUT', `${window.location.href}/comments/${commentOid}`, true);
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send(JSON.stringify(body));
}

/**
 * Deletes the comment
 * @param {string} commentOid The unique identifier of the comment
 */
function deleteComment(commentOid) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        location.reload();
      } else if (this.status == 500 || this.status == 404) {
        document.getElementById('message').textContent = this.responseText;
      }
    }
  };
  xhttp.open('DELETE', `${window.location.href}/comments/${commentOid}`, true);
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send();
}
