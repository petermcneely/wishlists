'use strict';

const getURL = (req, path) =>
  `${req.protocol}://${req.get('Host')}${path}`;

export {
  getURL,
}
