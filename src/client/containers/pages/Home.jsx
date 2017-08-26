import React from 'react'
import {observable, action } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment';
import Cookies from 'js-cookie'
import autobind from 'autobind-decorator'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CouponModel from '../../models/CouponModel';
import CouponStore from '../../stores/CouponStore';



@observer(["coupon"]) // Only required if you use or change the state outside fetchData
export default class Home extends React.Component {

	@observable
	state = {
		couponModel: null,
		formOpen: false,
		clientData: {},
		wrongCode: false
	}

	componentWillMount() {

        var {coupon} = this.props;
        this.state.couponModel = new CouponModel();
        this.state.couponModel.store = new CouponStore();
        this.state.couponModel.convertFromDB(coupon);
    }

	componentDidMount(){
        var { couponModel } = this.state
        var isPreview = this.getParameterByName('preview')
        if(!Cookies.get(`watched_${couponModel.id}`) && !isPreview) {
            Cookies.set(`watched_${couponModel.id}`, true)
            couponModel.watches++;
            couponModel.save();
        }


	}

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

	@autobind
	realizeCoupon() {

		var {couponModel, clientData} = this.state;
		couponModel.realized++;
		couponModel.friends.push(clientData)
		couponModel.save()
	}


	@autobind
	onChange(event) {
		this.updateProperty(event.target.name, event.target.value)
	}

	@autobind
	updateProperty(key, value) {
		var {clientData} = this.state;
		clientData[key] = value;
	}

	@autobind
	checkCode(e) {
		var {couponModel} = this.state;
		if (e.target.value !== couponModel.offer.code) {
			this.state.wrongCode = true;
		}
	}
    render() {

		var {coupon} = this.props;
		var { wrongCode, couponModel } = this.state;
		if( coupon.offer.endingDate <  moment().unix()) {
            return <div className="Coupon">
			 <div>פג התוקף של הקופון</div>
            </div>
        }

        return <div className="Coupon">
            <div>
                <img src={couponModel.offer.imageUrl}/>
                <h1>{couponModel.offer.title}</h1>
                <p>{couponModel.offer.description}</p>
                <p>בתוקף עד: {moment(coupon.endingDate).format('DD/MM/YYYY')}</p>
            </div>

            <div>

            </div>
            <div className="Coupon-realization">

                    <form>
                        <TextField name="clientName" onChange={this.onChange} hintText="שם"/>
                        <TextField name="phoneNumber" onChange={this.onChange} hintText="מספר טלפון"/>
                        <div className="form-button">
                            <RaisedButton secondary onClick={this.realizeCoupon}>שלח</RaisedButton>
                        </div>
                    </form>


            </div>

        </div>
    }
}