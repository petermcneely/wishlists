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
 * Sets the comment values for the edit modal
 * @param {string} commentOid The unique identifier of the comment
 * @param {string} body The body of the comment
 * @param {string} showOwner Whether or not the comment should be shown to the user
 */
function setValues(commentOid, body, showOwner) {
  document.getElementById('update-id').value = commentOid;
  document.getElementById('update-body').value = body;
  document.getElementById('update-show-owner').value = showOwner;
}

/**
 * Updates an comment
 */
function updateComment() {
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
  xhttp.open('PUT', `${window.location.href}/comments/${document.getElementById('update-id')}`, true);
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
