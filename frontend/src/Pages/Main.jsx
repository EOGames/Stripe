import React, { useEffect, useState } from 'react'
import { getAllProducts } from '../api/stripe.api';
import classes from './main.module.css';
import * as stripeApi from '../api/stripe.api';
import AddCard from './AddCard';
// import CardDetails from './CardDetails';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Notification from '../utility/Notification';

function Main({ getEmail }) {
    // Notification('error','It Works !');

    const [products, setProducts] = useState([]);
    const [openCardDetails, setOpenCardDetails] = useState(false);
    const [customerData,setCustomerData] = useState({
        email:'',
        customerId:'',
        price:0,
    });

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            let products = await getAllProducts();
            if (products.data?.data) {
                setProducts(products.data);
            } else {
                console.error('Products Not Found');
            }
            console.log('products', products);
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleAddCard = async (price) => {
        const email = getEmail();
        try {
            if (email && email.trim().length > 0) {
                console.log(email);
                const customerExist = await stripeApi.getStripeCustomer({ email: email });
                // console.log('customer exist Or Not',customerExist);
                if (customerExist)
                {
                    //means user exist
                    console.log(`customerFound `, customerExist);
                    setOpenCardDetails(true);    
                    setCustomerData({email:getEmail(),customerId:customerExist?.customer.id,price:price});


                } else {
                    // means user doesn't exist
                    console.log('user Not Found Its New User');
                    const newCustomer = await stripeApi.createStripeUser(email);
                    console.log('%c New Customer Created ', ' color:red ', newCustomer);
                    if (newCustomer?.customer.id) {
                        // add Card
                        setOpenCardDetails(true);
                        setCustomerData({email:getEmail(),customerId:newCustomer?.customer.id,price:price});
                    }
                }
            } else {
                alert('Please Enter A valid Email');
            }
        } catch (error) {
            console.log('Error', error);
        }
    }
    return (
        <div className={classes.productsCardHolder}>
            {console.log('Products to Render', products)}
            <>
                {
                    openCardDetails === false ?
                        <>
                            {
                                products?.data?.length > 0 && products?.data?.map((product, index) =>
                                    <div key={`productCard_${index}`} className={classes.card} >
                                        <div style={{ margin: '.5rem',textAlign:'center' }}>
                                        <label style={{ fontWeight: '900',marginRight:'5px' }} htmlFor="">Product Name:</label>
                                            {product.name}
                                        </div>
                                        <img style={{ margin: '1rem 0', maxWidth: '100%', height: '40%' }} src={product.images[0]} alt="" />
                                        <div style={{ border: '1px dotted grey', padding: '.2rem', width: '100%' }}>
                                            <span style={{ width: '100%', fontWeight: '900' }}>Description:</span>
                                            <span style={{ marginLeft: '7px' }}>{product.description}</span>
                                        </div>
                                        <div style={{ border: '1px dotted grey', padding: '.2rem', width: '100%', textAlign: 'center' }}>
                                            <span style={{ fontWeight: '900' }}>Price:</span> {products?.prices?.data[index]?.unit_amount / 100} {products?.prices?.data[index]?.currency}
                                            <div style={{ fontWeight: '900', textAlign: 'center' }}>Type:
                                                <span style={{ fontWeight: 'normal', marginLeft: '5px' }}>{products?.prices?.data[index]?.type.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginTop: '.9rem' }}>
                                            <button onClick={()=>handleAddCard(products?.prices?.data[index]?.unit_amount)} className={classes.addCardButton}>Add Card</button>
                                        </div>

                                    </div>

                                )
                            }
                        </>
                        :
                        <>
                            {<Elements stripe={stripePromise}>
                                <AddCard setOpenCardDetails ={setOpenCardDetails} data={customerData} />
                            </Elements>}
                        </>
                }

            </>

        </div>
    )
}

export default Main