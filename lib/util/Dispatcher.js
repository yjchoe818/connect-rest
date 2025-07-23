let Path = require('./Path')

exports.dispatch = function ( method, _path, url, handler ) {
	let path = new Path( '', _path, {} )

	return function (req, res, next) {
		if (method !== req.method && method !== '*') {
			return next()
		}

		// if(!req.query) req.query = {}
		if (!req.params) req.params = {}

		let pathname = url.parse( req.url ).pathname

		// Sanitize or validate the pathname to prevent reDOS
		if ( path.matches(
			req, sanitizePathname(pathname), '*', true, false
		) ) {
			for ( let key of Object.keys(req.query) )
				req.params[ key ] = req.query[ key ]
			return handler(req, res, next)
		}
		else
			return next()
	}
}

function sanitizePathname(pathname) {
	// Implement a basic sanitization or validation logic
	// For example, limit the length and remove potentially harmful characters
	if (pathname.length > 1000) {
		return pathname.substring(0, 1000);
	}
	return pathname.replace(/[^\w\-\/]/g, '');
}