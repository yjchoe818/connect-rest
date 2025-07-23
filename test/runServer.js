let http = require('http')
let https = require('https')
let fs = require('fs')

let connect = require('connect'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	compression = require('compression'),
	timeout = require('connect-timeout'),
	serveStatic = require('serve-static'),
	bodyParser = require('body-parser')

let rest = require('../lib/connect-rest')
let restBuilder = require('./restBuilder')

let app = connect()
	.use( compression() )
	.use( timeout( 2000 ) )
	.use( cookieParser( 'secretPass' ) )
	.use( cookieSession( {
		name: 'demo.sid',
		secret: 'secretPass',
		cookie: { httpOnly: true, secure: true } // Set secure to true
	} ) )
	.use( bodyParser.urlencoded( { extended: true } ) )
	.use( bodyParser.json() )
	.use( serveStatic( './web') )

let options = {
	context: '/api',
	logger: { level: 'debug' },
	apiKeys: [ '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9' ],
	discoverPath: 'discover',
	protoPath: 'proto',
	loose: { after: 1000 },
	domain: true
}
app.use( rest.rester( options ) )
app.use( restBuilder.getDispatcher( rest ) )

restBuilder.buildUpRestAPI( rest )

let port = process.env.PORT || 8080
let server = https.createServer({ // Use https instead of http
	key: fs.readFileSync('path/to/privatekey.pem'), // Add path to your SSL key
	cert: fs.readFileSync('path/to/certificate.pem') // Add path to your SSL certificate
}, app)

server.listen( port, function () {
	console.log('Running on https://localhost:8080')
})
