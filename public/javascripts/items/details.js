/* eslint-disable no-unused-vars */
/**
 * Updates an item
 * @return {boolean} whether the update was successful
 */
function update() {
  const body = {
    name: document.getElementById('name').value,
    comments: document.getElementById('comments').value,
    link: document.getElementById('link').value,
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

/**
 * Deletes the item
 * @param {string} occasionSlug The slug for the occasion
 * @param {string} wishlistSlug The slug for the wishlist
 * @return {boolean} success or not
 */
function doDelete(occasionSlug, wishlistSlug) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        window.location.href =
        '/occasions/' + occasionSlug + '/wishlists/' + wishlistSlug;
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
