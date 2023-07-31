const mongoose = require('mongoose');
const uri = process.env.DATABASE_URL;
mongoose.connect(uri);

const Stripe = new mongoose.Schema({
    email: String,
    stripeCustomerId: String,
});

const StripeUsers = mongoose.model('stripeUsers',Stripe)
module.exports = StripeUsers;