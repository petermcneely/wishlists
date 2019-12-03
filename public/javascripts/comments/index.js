/* eslint-disable no-unused-vars */
/**
 * Creates a comment
 */
function newComment() {
  $('#createModal').modal('hide');
  const showOwnerElem = document.getElementById('create-show-owner');
  const body = {
    body: document.getElementById('create-body').value,
    showOwner: showOwnerElem ? showOwnerElem.checked : true,
  };

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200 || this.status == 500 || this.status == 404) {
        location.reload();
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
  const showOwnerElem = document.getElementById('create-show-owner');
  if (showOwnerElem) {
    showOwnerElem.checked = showOwner;
  }
}

/**
 * Updates an comment
 */
function updateComment() {
  $('#updateModal').modal('hide');
  const showOwnerElem = document.getElementById('create-show-owner');
  const body = {
    body: document.getElementById('update-body').value,
    showOwner: showOwnerElem ? showOwnerElem.checked : true,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
      location.reload();
    }
  };
  const updateUrl = `${window.location.href}/comments/${document.getElementById('update-id').value}`;
  xhttp.open('PUT', updateUrl, true);
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
