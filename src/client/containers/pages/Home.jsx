import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import moment from 'moment';
import Cookies from 'js-cookie'
import autobind from 'autobind-decorator'
import {browserHistory} from 'react-router'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CouponModel from '../../models/CouponModel';
import CouponStore from '../../stores/CouponStore';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Link from 'react-router/lib/Link'

@observer(["coupon"]) // Only required if you use or change the state outside fetchData
export default class Home extends React.Component {

	@observable
	state = {
		couponModel: null,
		formOpen: false,
		clientData: {
			clientName: '',
			phoneNumber: ''
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
			couponModel.saveWatches();
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
		if (this.validateForm()) {
			couponModel.realized++;
			// couponModel.friends.push({
			//     clientName:clientData.clientName,
			//     phoneNumber:clientData.phoneNumber
			// })
			couponModel.saveRealizations({
				clientName: clientData.clientName,
				phoneNumber: clientData.phoneNumber
			});
			browserHistory.push("/thank-you")

		}
	}

	@autobind
	validateName() {
		var valid = true
		if (!this.state.clientData['clientName'].trim()) {
			this.state.clientNameError = 'הזן שם'
			valid = false
		}
		return valid
	}

	@autobind
	validatePhone() {
		var valid = true
		const phone = this.state.clientData['phoneNumber'];
		if (!phone.trim()) {
			this.state.phoneError = 'הזן מספר טלפון'
			valid = false
		}
		if (!phone.match(/^((\+972|972)|0)( |-)?([1-468-9]( |-)?\d{7}|(5|7)[0-9]( |-)?\d{7})$/)) {
			this.state.phoneError = 'מספר הטלפון שגוי'
			valid = false
		}
		return valid
	}

	validateForm() {
		var valid = true
		valid = valid && this.validatePhone()
		valid = valid && this.validateName()
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
		var {couponModel, clientNameError, phoneError} = this.state,
			business = couponModel.bussineData || {},
			offer = couponModel.offer,
			isOVerDue = moment(couponModel.offer.endingDate).isBefore(new Date()),
			telLink = 'tel:' + business.phone
		let iconStyles = {
			fontSize: 18,
			color: '#555',
			verticalAlign: 'middle',
			marginRight: 10
		}
		let mapLink = 'https://maps.google.com/?q=' + business.address

		if (!couponModel) {
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
				<div className="Coupon-img">
					<img src={offer.imageUrl}/>
					<div className="business-title">
						<p>{business.title}</p>
						<p>{business.description}</p>
					</div>
				</div>
				<div className="Coupon-title fadeInAnimation">
					<h1>{offer.title}</h1>
					<h2>{offer.description}</h2>
				</div>
				<Paper className="Coupon-inner-details fadeInAnimation">
					<p><FontIcon className="material-icons" style={iconStyles}>date_range</FontIcon>
						בתוקף עד: {moment(offer.endingDate).format('DD/MM/YY')}</p>
				</Paper>
				 <div className="terms fadeInAnimation">{offer.terms ? ('* '+ offer.terms) : null}</div>

				<Paper className="business-details fadeInAnimation">
					<div className="details-row">
						<p><FontIcon className="material-icons" style={iconStyles}>smartphone</FontIcon>
							<a href={telLink}>{business.phone}</a></p>
						<p><FontIcon className="material-icons"
									 style={iconStyles}>location_on</FontIcon>
							<a href={mapLink} target="_blank">
								{business.address}</a></p>
						<p><FontIcon className="material-icons" style={iconStyles}>link</FontIcon>
							<a href={business.website} target="_blank">{business.website}</a></p>
					</div>
				</Paper>
				<div className="Coupon-realization fadeInAnimation">
					<p>מעדיפים שנחזור אליכם? השאירו פרטים כאן:</p>
					<form>
						<TextField name="clientName" onChange={this.onChange} onFocus={() => {
							this.state.clientNameError = ''
						}} onBlur={this.validateName} hintText="שם"/>
						<div>{clientNameError}</div>
						<TextField name="phoneNumber" onChange={this.onChange} onFocus={() => {
							this.state.phoneError = ''
						}} onBlur={this.validatePhone} hintText="מספר טלפון"/>
						<div>{phoneError}</div>
						<div className="form-button">
							<RaisedButton secondary onClick={this.realizeCoupon}>שלח</RaisedButton>
						</div>
					</form>

					<Link to="/terms" target="_blank" className="terms-link">כפוף לתנאי השימוש</Link>
				</div>
			</div>
		}
	}
}