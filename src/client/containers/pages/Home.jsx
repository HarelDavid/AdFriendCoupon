import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import moment from 'moment';
import Cookies from 'js-cookie'
import autobind from 'autobind-decorator'
import { browserHistory } from 'react-router'
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
        thankYouMode: false,
		clientData: {
            clientName:'',
            phoneNumber:''
		},
        clientNameError: '',
        phoneError: ''
	}

	componentWillMount() {

		var {coupon} = this.props;
		this.state.couponModel = new CouponModel();
		this.state.couponModel.store = new CouponStore();
		this.state.couponModel.convertFromDB(coupon);
	}

	componentDidMount() {
		var {couponModel} = this.state
		var isPreview = this.getParameterByName('preview')
		if (!Cookies.get(`watched_${couponModel.id}`) && !isPreview) {
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
		if(this.validateForm()) {
            couponModel.realized++;
            couponModel.friends.push(clientData)
            couponModel.save()
			this.state.thankYouMode = true
                // .then(() => {
        		 //    browserHistory.push("/thank-you")
                // })
        }
	}

    @autobind
    validateName() {
        var valid = true
		if(!this.state.clientData['clientName'].trim()){
            this.state.clientNameError = 'הזן שם'
            valid =  false
		}
		return valid
    }

    @autobind
    validatePhone() {
        var valid = true
       const phone =  this.state.clientData['phoneNumber'];
       if(!phone.trim()){
           this.state.phoneError = 'הזן מספר טלפון'
           valid =  false
	   }
       if(!phone.match(/^((\+972|972)|0)( |-)?([1-468-9]( |-)?\d{7}|(5|7)[0-9]( |-)?\d{7})$/)){
		   this.state.phoneError = 'מספר הטלפון שגוי'
           valid =  false
	   }
        return valid
	}

	validateForm(){
        var valid = true
        valid = valid  && this.validatePhone()
        valid = valid  && this.validateName()
		return valid
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


	render() {
		var { couponModel, clientNameError, phoneError, thankYouMode} = this.state,
			business = couponModel.bussineData || {},
			offer = couponModel.offer,
			isOVerDue = moment(couponModel.offer.endingDate).isBefore(new Date()),
			telLink = 'tel:' + business.phone


		if(!couponModel) {
			return null;
		}

		if (isOVerDue) {
			return <div className="Coupon">
				<p>ההצעה אינה בתוקף</p>
				<p>ניתן לפנות ל{business.title} לפרטים נוספים {business.phone &&
				<a href={telLink}>{business.phone}</a>}</p>
			</div>
		} else {
			return <div className="Coupon">
				<div className="Coupon-inner">
					<div className="Coupon-img">
						<img src={offer.imageUrl}/>
					</div>
				<div>
					<h1>{offer.title}</h1>
					<p>{offer.description}</p>
					<p>בתוקף עד: {moment(offer.endingDate).format('DD/MM/YY')}</p>
					<div className="terms">* {offer.terms}</div>
				</div>

				<div className="business-details">
					<div className="details-row">
						<p>{business.title}</p>
						<p>{business.description}</p>
						<p>{business.address}</p>
					</div>
					<div className="details-row">
						<p><a href={telLink}>{business.phone}</a></p>
						<p><a href={business.website} target="_blank">{business.website}</a></p>
					</div>
				</div>
				<div className="Coupon-realization">

					<form>
						<TextField name="clientName" onChange={this.onChange} onFocus={() => {this.state.clientNameError = ''}} onBlur={this.validateName}  hintText="שם"/>
						<div>{clientNameError}</div>
						<TextField name="phoneNumber" onChange={this.onChange} onFocus={() => {this.state.phoneError = ''}}  onBlur={this.validatePhone} hintText="מספר טלפון"/>
						 <div>{phoneError}</div>
						<div className="form-button">
							<RaisedButton secondary onClick={this.realizeCoupon}>שלח</RaisedButton>
						</div>
					</form>


				</div>
				</div>
				{thankYouMode && <div className="Coupon">
					<div className="Coupon-inner">
						<div>
							<h1>תודה רבה</h1>
							<p>נציגינו יצרו איתך קשר בהקדם</p>

						</div>
					</div>
				</div>}
			</div>
		}
	}
}