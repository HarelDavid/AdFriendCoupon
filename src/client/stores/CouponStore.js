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
		var couponDB = coupon.convertToDB();
    	return Promise.all([
    		firebase.database().ref('coupons').child(couponDB.id).child('realized').set(couponDB.realized),
            firebase.database().ref('coupons').child(couponDB.id).child('watches').set(couponDB.watches),
            firebase.database().ref('coupons').child(couponDB.id).child('friends').set(couponDB.friends)
		])
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



