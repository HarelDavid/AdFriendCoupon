import {observable} from 'mobx';

export default class CouponModel {
	store;
	id;
	@observable offer;
	@observable clientId;
	@observable businessId;
	@observable watches;
	@observable link;
	@observable realized;
	@observable endingDate;



	constructor(data){
		if(data) {
			this.offer = data.offer || "";
			this.offerId = data.offer ? data.offer.id :  "";
			this.clientId = data.clientId || "";
			this.businessId = data.businessId || "";
			this.link = data.link || [];
			this.store = data.store || {};
			this.realized = data.realized || 0;
            this.watches = data.watches || 0;
			this.friends = data.friends || [];

		}
	}

	convertFromDB(couponDB) {
		this.offer = couponDB.offer;gi
		this.clientId = couponDB.clientId;
		this.offerId = couponDB.offerId;
		this.businessId = couponDB.businessId;
		this.link = couponDB.link;
		this.watches = couponDB.watches || 0;
		this.realized = couponDB.realized || 0;
		this.friends = couponDB.friends || [];
		this.bussineData = couponDB.bussineData || {};
		this.id = couponDB.id;


	}

	convertToDB() {
		var couponDB = {}
		couponDB.offer = this.offer || "";
		couponDB.offerId = this.offer ? this.offer.id :  "";
		couponDB.clientId = this.clientId || "";
		couponDB.businessId = this.businessId || "";
		couponDB.link = this.link || "";
		couponDB.id = this.id || "";
		couponDB.watches = this.watches || 0;
		couponDB.realized = this.realized || 0;
		couponDB.friends = this.friends || [];
		return couponDB;
	}

	save(){
		this.store.save(this);
	}

	destroy() {
		this.store.remove(this);
	}

	toJS() {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			imageUrl: this.imageUrl,
			key: this.key,
            endingData: this.endingDate,
            offer: this.offer
		};
	}

	static fromJS(store, object) {
		return new ClientModel({store:store, id:object.id, title:object.title, description:object.description,imageUrl:object.imageUrl});
	}
}
