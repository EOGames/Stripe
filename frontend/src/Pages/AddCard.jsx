import React, { useRef, useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { addCard, chargeCustomer, createStripeUser } from '../api/stripe.api';
import classes from './main.module.css';
import Notification from '../utility/Notification';

function AddCard({ data,setOpenCardDetails }) {
    const elements = useElements()
    const stripe = useStripe();
    const zipCode = useRef();
    const [loader,setLoader] = useState(false);
    // const email = useRef();

    const handleAddCard = async (e) => {
        if (loader)
        return;
        e.preventDefault();
        setLoader(true);
        try {
            if (!stripe || !elements || data.email.trim().length <= 0) {
                return;
            }
            const cardElement = elements.getElement(CardNumberElement);
            const response = await stripe.createToken(cardElement, zipCode.current.value);
            console.log('response Stripe Token', response);

            if (response?.token?.id) 
            {
                // let customer;                
                // check here if customer is already exisit with his email then check if theirs customer id or not
                // if theirs one retrive customer 
                // customer = await getStripeCustomer(customerId)

                //creating new customer
                // customer = await createStripeUser(email.current.value);
                // console.log('%c new customer',' color:green' ,customer);

                if (data.customerId) {
                    // add new card to customer
                    const addNewCard = await addCard(data.customerId, response.token.id);
                    console.log('%c New Card Added ', ' color:darkgreen', addNewCard);

                    if (addNewCard.status) {
                        // customer = await getStripeCustomer(customer.customer?.id);
                        //console.log('new customer Details',customer);
                        const charge = await chargeCustomer(data.price, data.customerId);
                        console.log('%c charge', ' color:purple', charge);
                        setLoader(false);

                        if (charge.status)
                        {
                            Notification('success',`${data.price/100} Payment Successfull !`);
                            setOpenCardDetails(false);
                        }
                    }
                }
            }
            else {
                if (response.error?.message) {
                    Notification('error',response.error.message);
                }
                setLoader(false);

            }
        } catch (error) {
            console.log('error Adding Card',error);
            setLoader(false);
        }
    }
    return (
        <div style={{ backgroundColor: 'white', padding: '2rem',borderRadius:'10px' }}>
            <div style={{ border: '1px solid grey', width: '200px', padding: '15px', marginBottom: '1rem', backgroundColor: '#e8e8e8' }}>
                <label className="label-name">Email</label>
                <div>
                    {console.log('email for render', data)}
                    <input value={data.email} disabled style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }} type="email" placeholder='email@email.com' />
                </div>
            </div>
            <div style={{ border: '1px solid grey', width: '200px', padding: '15px', marginBottom: '1rem' }}>
                <label className="label-name">Card Number</label>
                <div>
                    <CardNumberElement />
                </div>
            </div>
            <div style={{ border: '1px solid grey', width: '200px', padding: '15px', marginBottom: '1rem' }}>
                <label className="label-name">Card Expiry</label>
                <div>
                    <CardExpiryElement />
                </div>
            </div>
            <div style={{ border: '1px solid grey', width: '200px', padding: '15px', marginBottom: '1rem' }}>
                <label className="label-name">CVC</label>
                <div>
                    <CardCvcElement />
                </div>
            </div>
            <div style={{ border: '1px solid grey', width: '200px', padding: '15px', marginBottom: '1rem' }}>
                <label className="label-name">Zipcode</label>
                <div>
                    <input ref={zipCode} style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }} type="text" placeholder='000000' />
                </div>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <button className={classes.addCardButton} style={{color: loader ? 'green' : 'black'}} onClick={handleAddCard}>{loader ? 'Loading...' :'Save Card'}</button>
            </div>
        </div>
    )
}

export default AddCard