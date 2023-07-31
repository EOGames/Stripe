const { createStripeUser, getStripeCustomer, getAllProducts, chargeCustomer,addCard } = require('../controllers/stripe.controller');

const Router = require('express').Router();

Router.post('/createStripeUser',createStripeUser);
Router.post('/getStripeCustomer',getStripeCustomer);
Router.get('/getAllProducts',getAllProducts);
Router.post('/chargeCustomer',chargeCustomer)
Router.post('/addCard',addCard);

module.exports = Router;