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
    return error;
  }
}

export const getStripeCustomer = async (stripeCustomerId) => {
  console.log('type',typeof stripeCustomerId,stripeCustomerId);
  try {
    const response = await api().get(`/getStripeCustomer/${stripeCustomerId}`
    // , {
    //   stripeCustomerId: stripeCustomerId,
    // }
    );
    return response.data;
  } catch (error) {
    return error;
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