'use strict'

function breadcrumbMaker (ignoreDirectories) {
	var directoriesToIgnore = ignoreDirectories;
	return function (req, res, next) {
		var crumbs = req.originalUrl.split("/");
		crumbs.splice(0, 1);
		if (!directoriesToIgnore.find((e) => {return crumbs[0] === e}) && req.method === 'GET') {
			var capitalized = crumbs[0].charAt(0).toUpperCase() + crumbs[0].substr(1);
			req.breadcrumbs = [{
				label: capitalized,
				route: '/' + crumbs[0]
			}];

			for (var i = 1; i < crumbs.length; ++i) {
				capitalized = crumbs[i].charAt(0).toUpperCase() + crumbs[i].substr(1);
				req.breadcrumbs.push({
					label: capitalized,
					route: req.breadcrumbs[i-1].route + '/' + crumbs[i]
				});
			}
		}
		
		next()
	}
}

module.exports = breadcrumbMaker;