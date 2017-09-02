const path = require('path');
import admin from 'firebase-admin';

//-----------
// Spawn webpack as a separate process ( prevents pointless garbage collection in the same process )
//-----------

console.log(";;;",process.env.NODE_ENV)

let webpackconfig = path.join(__dirname, '../../config/webpack.config.'+((process.env.NODE_ENV === 'production') ? 'prod' : 'dev'))
require('child_process').spawn('node',[webpackconfig], { stdio: 'inherit' })

var fileLocation = (process.env.NODE_ENV === 'production') ?
	'../../config/adfriendprod-firebase-adminsdk-kp46z-d77802509f.json':
    '../../config/adfriend-73789-firebase-adminsdk-ybwjf-88215e211e.json'
var serviceAccount = require(path.join(__dirname, fileLocation));

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.NODE_ENV === 'production' ? "https://adfriendprod.firebaseio.com" : "https://adfriend-73789.firebaseio.com"
});


//-----------
// Setup and launch server
//-----------
require('./server.js')