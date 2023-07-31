const StripeUsers = require('../model/stripe.model');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.createStripeUser = async (req, res) => {
    const { email } = req.body;
    try {

        if (!email) {
            return res.status(400).json({ status: false, message: `Bad Request: email:${email}` });
        }

        // const token = await stripe.tokens.create({
        //     card: {
        //       number: cardNumber,
        //       exp_month: expMonth,
        //       exp_year: expYear,
        //       cvc: cvc,
        //     },
        //   });

        //   if (token.id)
        //   {

        const checkIfCustomerExists = await StripeUsers.findOne({ email: email });

        if (checkIfCustomerExists) {
            return res.status(409).json({ status: false, message: 'User Already Registered' });
        }

        const customer = await stripe.customers.create({
            email: email,
        });

        if (customer.id) {
            const newCustomer = new StripeUsers({ email: email, stripeCustomerId: customer.id });
            const resp = await newCustomer.save();
            console.log('New Customer Registred', resp);
            return res.status(200).json({ status: true, message: 'Account Created Sucessfully', customer: customer });
        }

        //   const account = await stripe.accounts.create({
        //       type: 'custom',
        //        country: 'US',
        //       email: email,
        //       capabilities: {
        //           card_payments: { requested: true },
        //           transfers: { requested: true },
        //       },
        //   });      
        //   }else
        //   {
        //     return res.status(500).json({status:false,message:'Some Error Occured While Creating Token'});
        //   }

    }
    catch (error) {
        console.log('Error while creating stripe Account', error);
        return res.status(500).json({ status: false, message: 'Error while creating stripe Account', error: error });
    }
}


//email or stripeCustomer id required
module.exports.getStripeCustomer = async (req, res) => {
    let { email, stripeCustomerId } = req.body;
    console.log('stripeCustomerId', stripeCustomerId);
    try {

        if (!stripeCustomerId && !email) {
            return res.status(400).json({ status: false, message: `Stripe ID or Email Required` });
        }

        if (email) {
            const user = await StripeUsers.findOne({ email: email });
            if (user && user.stripeCustomerId) {
                stripeCustomerId = user.stripeCustomerId;
            } else {
                return res.status(404).json({ status: false, message: `Stripe Customer Not Found` });
            }
        }
        const customer = await stripe.customers.retrieve(stripeCustomerId);

        if (customer) {
            return res.status(200).json({ status: true, message: 'success', customer: customer });
        } else {
            return res.status(404).json({ status: false, message: 'Stripe customer Not Found' });
        }
    } catch (error) {
        console.log(`Error while Getting Stripe customer Details:  ${error}`);
        return res.status(500).json({ status: false, message: 'Error while Getting Stripe customer Details', error: error });
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await stripe.products.list({
            // limit: 3,
        });
        const prices = await stripe.prices.list({});
        let data = allProducts.data;
        return res.status(200).json({ status: true, data: { data, prices: prices } });
    } catch (error) {
        console.log('Error While Getting Products Details', error);
        return res.status(500).json({ status: false, message: 'Error While Getting Products Details', error: error });
    }
}

module.exports.addCard = async (req, res) => {
    const { customerStripeId, tokenId } = req.body;
    try {
        if (!customerStripeId || !tokenId) {
            return res.status(400).json({ status: false, message: `customerStripeid:${customerStripeId} tokenid:${tokenId} both Required` });
        }
        const newCard = await stripe.customers.createSource(

            customerStripeId,

            { source: tokenId },

        );
        return res.status(200).json({ status: true, message: 'Card successfully Added', newCard });
    } catch (error) {
        console.log('Error While Adding New Card');
        return res.status(500).json({ status: false, message: 'Error While Adding New Card', error: error });
    }
}

module.exports.chargeCustomer = async (req, res) => {
    try {
        const { cost, customerStripeId, paymentMethod } = req.body;
        // commented Reason: - You cannot accept payments using this API as it is no longer supported in India.

        const charge = await stripe.charges.create({
            amount: cost,
            currency: 'usd',
            customer: customerStripeId,
        });



        // const charge = await stripe.paymentIntents.create({
        //     customer: customerStripeId, 
        //     amount: cost,
        //     currency: 'usd',
        //     payment_method_types: ['card'],
        //     confirm:true,
        //   });

        // const charge = await stripe.paymentIntents.create({
        //     amount: cost,
        //     currency: 'usd',
        //     payment_method:paymentMethod,
        //     // automatic_payment_methods: {enabled: true},
        //     customer:customerStripeId,
        //   });
        return res.status(200).json({ status: true, charge });
    } catch (error) {
        console.log('Error While [Buy] Stripe Charge', error);
        return res.status(500).json({ status: false, message: 'Error While [Buy] Stripe Charge', error: error });
    }
}

