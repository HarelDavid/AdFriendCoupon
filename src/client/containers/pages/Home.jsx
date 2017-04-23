import React from 'react'
import {observable, action } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment';
import autobind from 'autobind-decorator'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


@observer(["coupon"]) // Only required if you use or change the state outside fetchData
export default class Home extends React.Component {

	@observable
	state = {
		// coupon: null,
		formOpen: false,
		clientData: null,
		wrongCode: false
	}

	// componentDidMount(){
	// 	console.log(this.props)
	// }

	@autobind
	realizeCoupon() {

		var {coupon} = this.props;
		coupon.realized = true;
		coupon.save()
	}

	@autobind
	openForm() {
		this.state.formOpen = true;
	}

	@autobind
	onChange(event) {
		this.updateProperty(event.target.name, event.target.value)
	}

	updateProperty(key, value) {
		var {clientData} = this.state;
		clientData[key] = value;
	}

	@autobind
	checkCode(e) {
		var {coupon} = this.props;
		if (e.target.value !== coupon.offer.code) {
			this.state.wrongCode = true;
		}
	}
    render() {

		var {coupon} = this.props;

		console.log(coupon);


        return <div className="Coupon">
            <div>
                <img src={coupon.offer.imageUrl}/>
                <h1>{coupon.offer.title}</h1>
                <p>{coupon.offer.description}</p>
                <p>בתוקף עד: {moment(coupon.endingDate).format('DD/MM/YYYY')}</p>
            </div>

            <div>

            </div>
            <div className="Coupon-realization">
				{this.state.formOpen ?
                    <form>
                        <TextField name="clientName" onChange={this.onChange} hintText="שם"/>
                        <TextField name="clientEmail" onChange={this.onChange} hintText="כתובת מייל"/>
                        <TextField name="offerCode" onChange={this.checkCode} hintText="קוד קופון"/>
						{wrongCode && <p>הקוד שגוי</p> }
                        <div className="form-button">
                            <RaisedButton secondary onClick={this.realizeCoupon}>ממש</RaisedButton>
                        </div>
                    </form>
					:
                    <RaisedButton primary onClick={this.openForm}>ממש</RaisedButton>

				}
            </div>

        </div>
    }
}