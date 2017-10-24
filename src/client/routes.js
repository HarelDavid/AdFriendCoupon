import React from 'react'
import { Route } from 'react-router'
import App from './containers/App.jsx'

/**
 * Asynchronously load a file
 * @param main {String} - Main component
 * @returns {Function}
 */
function requireAsync(main) {
    return function(location, next) {
        next(null, require('./containers/pages/' + main + '.jsx'))
    }
}

/**
 * Routes are defined here. They are loaded asynchronously.
 * Paths are relative to the "components" directory.
 * @param {Object}
 * @returns {Object}
 */
export default function createRoutes() {
    return (<Route component={App}>
                <Route path="coupon/:couponId"      getComponent={requireAsync('Home')}/>
                <Route path="thank-you"      getComponent={requireAsync('ThankYou')}/>
                <Route path="*"      getComponent={requireAsync('NotFound')}/>
            </Route>)
}
