import React, { Component, Fragment } from 'react';
import './Checkout.css';
import IconSvg from '../../util/svgHandler';
import { connect } from 'react-redux';
import {Route, Switch } from 'react-router-dom';
import * as actions from '../../store/actions/index'
import FormUserInfo from './FormUserInfo/FormUserInfo';
import Delivery from './Delivery/Delivery';
import Payment from './Payment/Payment';
import Button from '../../components/Button/Button';
import { FormattedMessage } from 'react-intl'

class Checkout extends Component {

    state = {
        currentPage: this.props.currentCheckoutStep,
        addresses: []
    }

    componentDidMount(){
        window.scroll(0, 0);
        this.loadAdressHandler();
    }

  


    loadAdressHandler = () => {
        const token = localStorage.getItem('token');

        if(token) {

                    fetch('https://strix-market-place.herokuapp.com/address/',
                    {   
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    })
                    .then(res => {
                        if(res.status !== 200){
                            throw new Error('Failed to fectch adresses')
                        }
                        return  res.json();
                    })
                    .then( resData => {

                        this.setState({
                            addresses: resData.addresses
                        })
                    })
                    .catch( err => {
                        console.log(err)
                    })
            }
        
    }


    componentWillReceiveProps(nextProps){
        this.setState({currentPage: nextProps.currentCheckoutStep},
  )}

 

    selectAdressHander(data){
        this.props.selectAddressHandler(data);
        this.props.updateCheckoutStep('delivery'); 
        this.setState({
            currentCheckoutStep: 'delivery'
        })
    }

    render() {

        let addresses;

        if(this.state.addresses) {
            
            addresses = (
                <section className="checkout__addresses">
                    {
                        this.state.addresses.map( address => (
                            <article className="checkout__addresses__item">

                            <div className="checkout__addresses__item__details">
                                <div className="checkout__addresses__item__name">{address.fullname}</div>
                                <div>{address.address1}</div>
                                <div>{address.address2}</div> 
                                <div>{address.city}, {address.zip}</div>
                                <div>{address.state}</div>
                                <div>email: {address.email}</div>
                                <div>tel: {address.phoneNumber}</div>
                            </div>
                                


                                <button className="checkout__addresses__item__choose"
                                        onClick={this.selectAdressHander.bind(this, address)}>
                                    <FormattedMessage id="select" defaultMessage="Select"/>
                                </button>
                                <div className="checkout__addresses__item__cta">
                                    <Button color="grey">
                                        <FormattedMessage id="edit" defaultMessage="Edit"/>
                                    </Button>
                                    <Button color="grey">
                                        <FormattedMessage id="delete" defaultMessage="Delete"/>
                                    </Button>
                                </div>
                            </article>
                ))
                    }
                </section>
            )}

        


        return (

            
            <div className="checkout">
                <div className="checkout__steps">
                    <div className="checkout__steps__line">
                        <div className="checkout__steps__line__bellow"></div>
                        <div className={["checkout__steps__line__upper",

                            this.state.currentPage === 'delivery' ? 'delivery' : '',
                            this.state.currentPage === 'payment' ? 'payment' : ''  
                        ].join(' ')}></div>

                        <span className={[
                            this.state.currentPage === 'delivery' ? 'delivery' : '',
                            this.state.currentPage === 'payment' ? 'payment' : '' 
                        ].join(' ')}>
                            <IconSvg icon="cart"/>
                        </span>
                        
                    </div>
                    <div className="checkout__steps__name">
                        <div>Information</div>
                        <div><FormattedMessage id="delivery" defaultMessage="Delivery"/></div>
                        <div><FormattedMessage id="payment" defaultMessage="Paiement"/></div>
                    </div>
                </div>

                {                
                    this.state.currentPage === 'checkout' && (
                        <Fragment>
                            {addresses}
                            <FormUserInfo />
                        </Fragment>
                    )
                }



                {
                    this.state.currentPage === 'delivery' && (
                        <Delivery />
                    )
                }

                {
                    this.state.currentPage === "payment" && (
                        <Payment />
                    )
                }

                


                
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        products: state.cart.products,
        totalProductsCount: state.cart.totalProductsCount,
        subTotalPrice: state.cart.subTotalPrice,
        taxes: state.cart.taxes,
        totalPrice: state.cart.totalPrice,
        userInfos: state.cart.userInfos,

        currentCheckoutStep: state.cart.checkoutStep
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectAddressHandler: (data) => dispatch(actions.selectAddressHandler(data) ),
        updateCheckoutStep: (nextStep) => dispatch(actions.updateCheckoutStep(nextStep))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);

