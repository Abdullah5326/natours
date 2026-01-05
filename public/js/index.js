// eslint-disabled
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

const formLogin = document.querySelector('.form--login');
const btnLogout = document.querySelector('.nav__el--logout ');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const btnBookings = document.querySelector('.btn-booking-tour');

if (formLogin)
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

if (btnLogout) {
  btnLogout.addEventListener('click', logout);
}

if (formUserData)
  formUserData.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (formUserPassword)
  formUserPassword.addEventListener('submit', function (e) {
    e.preventDefault();

    const password = document.querySelector('#password-current').value;
    const newPassword = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#password-confirm').value;

    updateSettings({ password, newPassword, confirmPassword }, 'password');
  });

if (btnBookings)
  btnBookings.addEventListener('click', function (e) {
    const { tourId } = e.target.dataset;

    bookTour(tourId);
  });
