'use strict';

const getBody = (comment, url) =>
  `<p>Someone wrote: ${comment}</p>` +
  `<p>Click <a href=\'${url}\'>here</a> to view your wishlist.</p>` +
  '<br/><br/>' +
  '<p>If the link doesn\'t work, ' +
  'copy and paste the following into a browser: ' +
  url + '.</p>';

const getSubjectLine = (isUpdate) =>
  isUpdate ? "Someone updated their comment on your wishlist" : "A new comment was posted on your wishlist";

export {
  getBody,
  getSubjectLine,
}
