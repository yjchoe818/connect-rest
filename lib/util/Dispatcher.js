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

		// Sanitize the pathname to prevent reDOS attacks
		if ( path.matches(
			req, pathname.replace(/[^a-zA-Z0-9\/]/g, ''), '*', true, false
		) ) {
			for ( let key of Object.keys(req.query) )
				req.params[ key ] = req.query[ key ]
			return handler(req, res, next)
		}
		else
			return next()
	}
}