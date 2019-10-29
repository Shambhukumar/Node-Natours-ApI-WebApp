const express = require('express');

const router = express.Router();

const viewController = require('./../controller/viewController');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');

router.use(viewController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getoverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.signin);
router.get('/signup', authController.isLoggedIn, viewController.signUp);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
module.exports = router;
