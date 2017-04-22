const path = require('path');
import admin from 'firebase-admin';

//-----------
// Spawn webpack as a separate process ( prevents pointless garbage collection in the same process )
//-----------
let webpackconfig = path.join(__dirname, '../../config/webpack.config.'+((process.env.NODE_ENV === 'production') ? 'prod' : 'dev'))
require('child_process').spawn('node',[webpackconfig], { stdio: 'inherit' })


var serviceAccount = require(path.join(__dirname, '../../config/adfriend-73789-firebase-adminsdk-ybwjf-88215e211e.json'));

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://adfriend-73789.firebaseio.com"
});


//-----------
// Setup and launch server
//-----------
require('./server.js')