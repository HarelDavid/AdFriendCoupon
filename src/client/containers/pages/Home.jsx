import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'

@observer(["coupon"]) // Only required if you use or change the state outside fetchData
export default class Home extends React.Component {


    render() {
        return <section>
            <h1>Coupon</h1>
            <p>Welcome to the fastest website in the universe !</p>
        </section>
    }
}