/* eslint-disable no-unused-vars */
/**
 * Redirects to the wishlist list
 * @param {string} occasionSlug The slug of the occasion
 * @param {string} wishlistSlug The slug of the wishlist
 */
function cancel(occasionSlug, wishlistSlug) {
  window.location.href =
    '/occasions/' + occasionSlug + '/wishlists/' + wishlistSlug;
}

/**
 * Creates the item
 * @param {string} occasionSlug The slug of the occasion
 * @param {string} wishlistSlug The slug of the wishlist
 * @return {boolean}
 */
function create(occasionSlug, wishlistSlug) {
  const body = {
    name: document.getElementById('name').value,
    comments: document.getElementById('comments').value,
    link: document.getElementById('link').value,
  };

  if (body.name.trim() === '') {
    showAlert('The item name cannot be blank.', 500);
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status === 200) {
          window.location.href =
          '/occasions/' + occasionSlug + '/wishlists/' + wishlistSlug;
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
