let rest = require('../../lib/connect-rest')

let https = require('https') // Changed from 'http' to 'https'
let connect = require('connect')
let fs = require('fs') // Added to read SSL certificate and key

let connectApp = connect()
global.server = connectApp

connectApp.use( connect.query() )
let options = {
	discoverPath: 'discover',
	protoPath: 'proto',
	logger: 'connect-rest',
	logLevel: 'debug'
}
connectApp.use( rest.rester( options ) )

// Load SSL certificate and key
let sslOptions = {
	key: fs.readFileSync('path/to/private/key.pem'), // Specify the path to your private key
	cert: fs.readFileSync('path/to/certificate.pem') // Specify the path to your certificate
}

let server = https.createServer( sslOptions, connectApp ) // Changed from 'http' to 'https'

server.listen( 8095 )

rest.post('/service', function ( request, content, callback ) {
	console.log( 'Service Received:', request )
	return callback(null, {result: 'Async call is done!'})
})