'use strict';

export function getBody(email, url) {
  return '<p>Hi there!</p>' +
    '<p>Super excited to manage wishlists with you!</p>' +
    '<p>Head on over to ' + url + ' to verify your email address.</p>';
}
export function getSubjectLine() {
  return 'Please verify your email.';
}
