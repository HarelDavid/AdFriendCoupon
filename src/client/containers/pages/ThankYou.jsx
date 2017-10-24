import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'


export default class ThankYou extends React.Component {


        render() {

                return <div className="Coupon">
                    <div className="Coupon-inner">
                        <div>
                            <h1>תודה רבה</h1>
                            <p>נציגינו יצרו איתך קשר בהקדם</p>

                        </div>
                    </div>
                </div>
            }

}