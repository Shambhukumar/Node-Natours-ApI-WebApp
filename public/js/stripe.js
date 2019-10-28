/* es;int-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_dCe0d8Zv0Yd9i5NBs8a040uY00MHiRPbD1');
export const bookTour = async tourId => {
  try {
    //1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    //2) Create checkout from + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
