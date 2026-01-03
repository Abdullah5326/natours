import { showAlert } from './alert';

export const updateSettings = async function (data, type) {
  try {
    console.log(data);
    const url =
      type === 'password'
        ? `http://127.0.0.1:3000/api/v1/users/updatePassword`
        : `http://127.0.0.1:3000/api/v1/users/updateMe`;
    const res = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'content-Type': 'application/json',
      },
    });

    const dataApi = await res.json();

    if (dataApi.status === 'success') {
      showAlert('success', `Updated the ${type} succefully`);
      window.setTimeout(function () {
        location.reload(true);
      }, 1500);
    }

    if (dataApi.status === 'error') {
      throw new Error(dataApi.message);
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};
