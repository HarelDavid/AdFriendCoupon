import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'

@observer(["state"]) // Only required if you use or change the state outside fetchData
export default class About extends React.Component {
    @action static fetchData({state}){
        state.app.title = 'Terms and Conditions'
    }
    render() {
        return <section>

        </section>
    }
}