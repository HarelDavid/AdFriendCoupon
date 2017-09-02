import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import { Router, RouterContext, browserHistory } from 'react-router'
import firebase from 'firebase';

import { createClientState } from './state'
import createRoutes from './routes'

import autorun from './autorun.js'

// Get actions object
import actions from './actions'

// Import our styles
require('./assets/css/index.scss')
const isProd = process.env.NODE_ENV === 'production'
console.log("isProd" + isProd)
var configFirebase;
 if ( !isProd) {
    configFirebase = {
        apiKey: "AIzaSyDieUaSUVR8dTDTsWb-UVkCXzkAn04G9KE",
        authDomain: "adfriend-73789.firebaseapp.com",
        databaseURL: "https://adfriend-73789.firebaseio.com",
        storageBucket: "adfriend-73789.appspot.com",
        messagingSenderId: "640171697438"
    };
 }
 else {
    configFirebase  = {
        apiKey: "AIzaSyA9hrvUvs6uBVvO2ianh5IQQp7qFjQB4OY",
        authDomain: "adfriendprod.firebaseapp.com",
        databaseURL: "https://adfriendprod.firebaseio.com",
        projectId: "adfriendprod",
        storageBucket: "adfriendprod.appspot.com",
        messagingSenderId: "370997730739"
    };

}
firebase.initializeApp(configFirebase);





// Initialize stores
const coupon = createClientState()

// Setup autorun ( for document title change )
autorun(coupon);



// Wrap RouterContext with Provider for state transfer
function createElement(props) {
    return <Provider coupon={coupon} actions={actions} >
        <RouterContext {...props} />
    </Provider>
}

let ignoreFirstLoad = true;
function onRouterUpdate() {

    if (ignoreFirstLoad){
        ignoreFirstLoad=false;
        return
    }

    // Page changed, executing fetchData
    let params = this.state.params;
    let query = this.state.location.query;

    this.state.components.filter(c => c.fetchData).forEach(c => {
        c.fetchData({ state, params, actions, query })
    })
}


// Render HTML on the browser
function renderRouter() {
    render(<Router history={browserHistory}
                render={createElement}

                routes={createRoutes()}/>,
    document.getElementById('root'))
}

renderRouter()