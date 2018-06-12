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
import classNames from 'classnames';


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
        phoneError: '',
        isCallingCard: false
    }

    componentWillMount() {

        var {coupon} = this.props;
        this.state.couponModel = new CouponModel();
        this.state.couponModel.store = new CouponStore();
        this.state.couponModel.convertFromDB(coupon);
        coupon.offer.templateId === 1 && (this.state.isCallingCard = true);

    }

    componentDidMount() {
        var {couponModel} = this.state
        var isPreview = this.getParameterByName('preview');

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

        let {couponModel, clientNameError, phoneError, isCallingCard} = this.state;

        if (!couponModel) {
            return null;
        }

        let business = couponModel.bussineData || {},
            offer = couponModel.offer,
            isOVerDue = offer.endingDate && moment(couponModel.offer.endingDate).isBefore(new Date()),
            telLink = 'tel:' + business.phone,
            iconStyles = {
                fontSize: 18,
                color: '#555',
                verticalAlign: 'middle',
                marginRight: 10
            },
            mapLink = 'https://maps.google.com/?q=' + business.address,
            templateClass = classNames('Template', 'template-' + offer.templateId),
            termsDefaultValue = offer.terms ? ('*' + offer.terms) : null;



        if (isOVerDue) {
            return <div className="Template Coupon-expired">
                <svg fill="#eb4335" height="60" viewBox="0 0 24 24" width="60">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path
                        d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
                <div className="Coupon-title">
                    <h1 style={{textAlign: 'center'}}>ההצעה אינה בתוקף</h1>
                    <br/>
                    <p>ניתן לפנות ל{business.title} לפרטים נוספים </p>
                </div>
                <Paper className="business-details fadeInAnimation">
                    <div className="details-row">
                        <p><FontIcon className="material-icons" style={iconStyles}>smartphone</FontIcon>
                            <a href={telLink}>{business.phone}</a></p>
                        {business.address && <p><FontIcon className="material-icons"
                                                          style={iconStyles}>location_on</FontIcon>
                            <a href={mapLink} target="_blank">
                                {business.address}</a></p>}
                        {business.website && <p><FontIcon className="material-icons" style={iconStyles}>link</FontIcon>
                            <a href={business.website} target="_blank">{business.website}</a></p>}
                    </div>
                </Paper>
            </div>
        } else {

            return <div className={templateClass}>
                <div className="Coupon-img">
                    {offer.imageUrl ? <img src={offer.imageUrl}/> : <div className="no-image"/>}
                    {!isCallingCard &&
                    <div className="business-title">
                        <p>{business.title}</p>
                        <p>{business.description}</p>
                    </div>
                    }
                </div>
                <div className="Coupon-title fadeInAnimation">
                    {/*h1*/}
                    <div className="row h1">
                        <h1>{offer.title}</h1>

                    </div>
                    {/*h2*/}
                    <div className="row h2">
                        <h2>{offer.description}</h2>
                    </div>
                </div>
                {!isCallingCard &&
                <div className="fadeInAnimation" style={{width: '100%', marginTop: 20}}>
                    <Paper className="Coupon-inner-details">
                        {/*p*/}
                        <p><FontIcon className="material-icons" style={iconStyles}>date_range</FontIcon>
                            בתוקף עד: {moment(offer.endingDate).format('DD/MM/YY')}</p>
                    </Paper>
                    <div className="terms fadeInAnimation">{offer.terms ? ('* ' + offer.terms) : null}</div>
                </div>
                }

                <Paper className="business-details fadeInAnimation">
                    <div className="details-row">
                        <p><FontIcon className="material-icons" style={iconStyles}>smartphone</FontIcon>
                            <a href={telLink}>{business.phone}</a></p>
                        {business.address && <p><FontIcon className="material-icons"
                                                          style={iconStyles}>location_on</FontIcon>
                            <a href={mapLink} target="_blank">
                                {business.address}</a></p>}
                        {business.website &&
                        <p><FontIcon className="material-icons" style={iconStyles}>link</FontIcon>
                            <a href={business.website} target="_blank">לאתר</a></p>}
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

                    <a href="/terms" target="_blank" className="terms-link">כפוף לתנאי השימוש</a>
                </div>

            </div>


            // return <div className="Coupon">
            //     <div className="Coupon-img">
            //         <img src={offer.imageUrl}/>
            //         <div className="business-title">
            //             <p>{business.title}</p>
            //             <p>{business.description}</p>
            //         </div>
            //     </div>
            //     <div className="Coupon-title fadeInAnimation">
            //         <h1>{offer.title}</h1>
            //         <h2>{offer.description}</h2>
            //     </div>
            //     <Paper className="Coupon-inner-details fadeInAnimation">
            //         <p><FontIcon className="material-icons" style={iconStyles}>date_range</FontIcon>
            //             בתוקף עד: {moment(offer.endingDate).format('DD/MM/YY')}</p>
            //     </Paper>
            //     <div className="terms fadeInAnimation">{offer.terms ? ('* ' + offer.terms) : null}</div>
            //
            //     <Paper className="business-details fadeInAnimation">
            //         <div className="details-row">
            //             <p><FontIcon className="material-icons" style={iconStyles}>smartphone</FontIcon>
            //                 <a href={telLink}>{business.phone}</a></p>
            //             {business.address && <p><FontIcon className="material-icons"
            //                                               style={iconStyles}>location_on</FontIcon>
            //                 <a href={mapLink} target="_blank">
            //                     {business.address}</a></p>}
            //             {business.website && <p><FontIcon className="material-icons" style={iconStyles}>link</FontIcon>
            //                 <a href={business.website} target="_blank">{business.website}</a></p>}
            //         </div>
            //     </Paper>
            //     <div className="Coupon-realization fadeInAnimation">
            //         <p>מעדיפים שנחזור אליכם? השאירו פרטים כאן:</p>
            //         <form>
            //             <TextField name="clientName" onChange={this.onChange} onFocus={() => {
            //                 this.state.clientNameError = ''
            //             }} onBlur={this.validateName} hintText="שם"/>
            //             <div>{clientNameError}</div>
            //             <TextField name="phoneNumber" onChange={this.onChange} onFocus={() => {
            //                 this.state.phoneError = ''
            //             }} onBlur={this.validatePhone} hintText="מספר טלפון"/>
            //             <div>{phoneError}</div>
            //             <div className="form-button">
            //                 <RaisedButton secondary onClick={this.realizeCoupon}>שלח</RaisedButton>
            //             </div>
            //         </form>
            //
            //         <Link to="/terms" target="_blank" className="terms-link">כפוף לתנאי השימוש</Link>
            //     </div>
            // </div>
        }
    }
}