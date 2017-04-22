import { observable, toJS } from 'mobx'
import mergeObservables from '../server/helpers/mergeObservables'

// Default state structure
let defaultState =  observable({
    app: {
        title: 'Mobx Isomorphic Starter',
        description : 'Here goes description',
        host: ''
    },
    browse: {
        data : ''
    }
})


// Export function that creates our server state
export const createServerState = (coupon) => {coupon}

// Export function that creates our client state
export const createClientState = () => {return  window.__STATE}
