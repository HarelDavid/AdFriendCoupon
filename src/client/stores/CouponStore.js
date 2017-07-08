import {observable, computed} from 'mobx'
import CouponModel from '../models/CouponModel'
//import * as Utils from '../utils';
import * as firebase from 'firebase';



export default class CouponStore {
	@observable coupons = [];

	constructor() {

	}

	init(){
		this.couponRef = firebase.database().ref('coupons');
	}
	// Find all dinosaurs whose height is exactly 25 meters.


	getCouponsByOfferId(offerId){

		return this.couponRef.orderByChild("offerId").equalTo(offerId).once("value").then((snapshot) => {
			var couponsById = snapshot.val();
			var coupons = [];
			if(couponsById) {

				for (var key in couponsById) {
					if (couponsById.hasOwnProperty(key)) {
						var coupon  = couponsById[key];
						var couponModel = new CouponModel();
						coupons.push(couponModel.convertFromDB(coupon));
					}
				}

			}
			return coupons;
		});

	}



	getCoupon(id){
		return firebase.database().ref('/coupons/' + id).once('value').then((snapshot) => {
			var coupon  = snapshot.val();

				var couponModel = new CouponModel();
				couponModel.convertFromDB(coupon);
				couponModel.store = this;
				return couponModel;

		});

	}



	//add or update
	save(coupon) {

		if(!coupon.id){
			var couponId = Utils.uuid();
			coupon.id = couponId;
			coupon.store = this;
		}
		debugger
		var hostData = 'http://api.adfriend.co.il';
		var linkData = `/coupon/${coupon.id}`;
		var couponsLink = `${hostData}${linkData}`;
		coupon.link = couponsLink;


		if(!this.coupons.find(it => it.id == coupon.id)) {
			this.coupons.push(coupon);
		}
		var couponDB = coupon.convertToDB();
		firebase.database().ref('coupons').child(couponDB.id).set(couponDB);
	}



	toJS() {
		return this.coupons.map(offer => offer.toJS());
	}

	static fromJS(array) {
		const store = new CouponStore();
		// store.offers = array.map(item => OfferModel.fromJS(offerStore, item));
		return store;
	}
}



