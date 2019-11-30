'use strict';

/**
 * Makes the breadcrumbs
 * @param {Array} ignoreDirectories The directories to ignore
 * @return {function} the next pipeline step.
 */
function breadcrumbMaker(ignoreDirectories) {
  const directoriesToIgnore = ignoreDirectories;
  return function(req, res, next) {
    const crumbs = req.originalUrl.split('/');
    crumbs.splice(0, 1);
    if (!directoriesToIgnore.find((e) => crumbs[0] === e) &&
    req.method === 'GET') {
      let capitalized = crumbs[0].charAt(0).toUpperCase() + crumbs[0].substr(1);
      req.breadcrumbs = [{
        label: capitalized,
        route: '/' + crumbs[0],
      }];

      for (let i = 1; i < crumbs.length; ++i) {
        capitalized = crumbs[i].charAt(0).toUpperCase() + crumbs[i].substr(1);
        req.breadcrumbs.push({
          label: capitalized,
          route: req.breadcrumbs[i-1].route + '/' + crumbs[i],
        });
      }
    }

    next();
  };
}

module.exports = breadcrumbMaker;
