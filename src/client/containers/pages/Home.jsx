import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
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
		var {wrongCode, couponModel} = this.state,
			business = couponModel.bussineData || {},
			offer = couponModel.offer,
			isOVerDue = moment(couponModel.offer.endingDate).isBefore(new Date()),
			telLink = 'tel:' + business.phone

		console.log(this.props.coupon)
		console.log(couponModel);


		if (isOVerDue) {
			return <div className="Coupon">
				<p>ההצעה אינה בתוקף</p>
				<p>ניתן לפנות ל{business.title} לפרטים נוספים {business.phone &&
				<a href={telLink}>{business.phone}</a>}</p>
			</div>
		} else {
			return <div className="Coupon">
				<div>
					<img src={offer.imageUrl}/>
					<h1>{offer.title}</h1>
					<p>{offer.description}</p>
					<p>בתוקף עד: {moment(offer.endingDate).format('DD/MM/YY')}</p>
					<div className="terms">{offer.terms}</div>
				</div>

				<div className="business-details">
					<div className="details-row">
						<p>{business.title}</p>
						<p>{business.description}</p>
						<p>{business.address}</p>
					</div>
					<div className="details-row">
						<p>{business.phone}</p>
						<p><a href={business.website} target="_blank">{business.website}</a></p>
					</div>
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
}