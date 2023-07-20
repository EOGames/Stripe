import React, { useRef } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { addCard, chargeCustomer, createStripeUser } from '../api/stripe.api';

function AddCard() {
	const elements = useElements()
    const stripe = useStripe();
    const zipCode = useRef();
    const email = useRef();

    const handleAddCard = async(e)=>
    {
        e.preventDefault();
        try {
            if (!stripe || !elements || email.current.value.trim().length <=0) {
                return;
            }
            const cardElement = elements.getElement(CardNumberElement);
            const response = await stripe.createToken(cardElement, zipCode.current.value);
            console.log('response Stripe Token',response);
    
            if (response.token.id)
            {
                let customer;                
                // check here if customer is already exisit with his email then check if theirs customer id or not
                // if theirs one retrive customer 
                // customer = await getStripeCustomer(customerId)
                
                //creating new customer
                    customer = await createStripeUser(email.current.value);
                    console.log('%c new customer',' color:green' ,customer);

                    if (customer.customer?.id)
                    {
                        // add new card to customer
                        const addNewCard = await addCard(customer.customer.id,response.token.id);
                        console.log('%c New Card Added ',' color:darkgreen',addNewCard);

                        if (addNewCard.status)
                        {
                           // customer = await getStripeCustomer(customer.customer?.id);
                            //console.log('new customer Details',customer);
                            const charge = await chargeCustomer(100,customer.customer.id);
                            console.log('%c charge',' color:purple',charge);
                        }
                    }
            }
            else
            {
                if (response.error?.message)
                {
                    alert(response.error.message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <div style={{border:'1px solid grey',width:'200px',padding:'15px',marginBottom:'1rem'}}>
                <label className="label-name">Email</label>
                <div>
                <input ref={email} style={{border:'none'}} type="email" placeholder='email@email.com' />
                </div>
            </div>
            <div style={{border:'1px solid grey',width:'200px',padding:'15px',marginBottom:'1rem'}}>
                <label className="label-name">Card Number</label>
                <div>
                    <CardNumberElement />
                </div>
            </div>
            <div style={{border:'1px solid grey',width:'200px',padding:'15px',marginBottom:'1rem'}}>
                <label className="label-name">Card Expiry</label>
                <div>
                    <CardExpiryElement />
                </div>
            </div>
            <div style={{border:'1px solid grey',width:'200px',padding:'15px',marginBottom:'1rem'}}>
                <label className="label-name">CVC</label>
                <div>
                    <CardCvcElement />
                </div>
            </div>
            <div style={{border:'1px solid grey',width:'200px',padding:'15px',marginBottom:'1rem'}}>
                <label className="label-name">Zipcode</label>
                <div>
                    <input ref={zipCode} style={{border:'none'}} type="text" placeholder='000000' />
                </div>
            </div>
            <button onClick={handleAddCard}>AddCard</button>
        </div>
    )
}

export default AddCard