import api from "./api";


export const createStripeUser = async (email) => {
  try {
    const response = await api().post('/createStripeUser',
      {
        email: email,
      });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.log('error',error);
    return false;
  }
}

//Only one of email or stripe customer id is required data = {email, stripeCustomerId} leave other 
export const getStripeCustomer = async (data) => {
  try {
    const response = await api().post(`/getStripeCustomer`,
    data    
    );
    return response.data;
  } catch (error) {
    console.log('Error While Getting Stripe Customer',error);
    return false;
  }
}

export const addCard = async (customerStripeId,tokenId) => {
  try {
    const response = await api().post('/addCard',
      {
        customerStripeId: customerStripeId,
        tokenId: tokenId,
      });
      return response.data;
  } catch (error) {
    
      return error;
  }
}

export const chargeCustomer = async (cost,customerStripeId,paymentMethod ) => {
  try {
    const response = await api().post('/chargeCustomer',
      {
        customerStripeId: customerStripeId,
        cost: cost,
        paymentMethod:paymentMethod,
      });
      return response.data;
  } catch (error) {
      return error;
  }
}

export const getAllProducts = async()=>
{
  try {
    const response = await api().get('/getAllProducts');
    if (response.data)
    {
      return response.data;
    }
  } catch (error) {
    return error;
  }
}