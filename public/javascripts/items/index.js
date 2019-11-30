/* eslint-disable no-unused-vars */
/**
 * Puts a claim on the item
 * @param {string} itemSlug The slug of the item
 */
function claim(itemSlug) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
      showAlert(JSON.parse(this.response).message, this.status);
      const actionButton = document.getElementById('actionButton-' + itemSlug);
      actionButton.classList.remove('btn-success');
      actionButton.classList.add('btn-danger');
      actionButton.setAttribute('onclick', 'unclaim(\'' + itemSlug + '\')');
      actionButton.textContent = 'Unclaim';
      document.getElementById('status-' + itemSlug).textContent = 'Claimed';
    }
  };
  xhttp.open('PUT',
      window.location.href + '/items/' + itemSlug + '/claim', true);
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send();
}

/**
 * Unclaims an item
 * @param {string} itemSlug The slug of the item
 */
function unclaim(itemSlug) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200 || this.status == 500)) {
      showAlert(JSON.parse(this.response).message, this.status);
      const actionButton = document.getElementById('actionButton-' + itemSlug);
      actionButton.classList.remove('btn-danger');
      actionButton.classList.add('btn-success');
      actionButton.setAttribute('onclick', 'claim(\'' + itemSlug + '\')');
      actionButton.textContent = 'Claim';
      document.getElementById('status-' + itemSlug).textContent = 'Unclaimed';
    }
  };
  xhttp.open('PUT',
      window.location.href + '/items/' + itemSlug + '/unclaim', true);
  xhttp.setRequestHeader('X-CSRF-TOKEN',
      document.getElementById('_csrf').value);
  xhttp.send();
}

/**
 * Handles redirecting to the item's detail page.
 * @param {string} owns String denoting whether the current user owns the item
 * @param {string} wishlistSlug The slug of the wishlist
 * @param {string} itemSlug The slug of the item
 */
function goTo(owns, wishlistSlug, itemSlug) {
  if (owns === 'true') {
    window.location.href = wishlistSlug + '/items/' + itemSlug;
  }
}
