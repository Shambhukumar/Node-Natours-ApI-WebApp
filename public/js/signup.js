import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  // "name": "natours",
  // "email": "natours@mailsac.com",
  // "password": "test1234",
  // "passwordConfirm": "test1234"
  try {
    const res = await axios({
      method: 'POST',
      url: 'api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Account Created Successfully Please check Your Email!!'
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
