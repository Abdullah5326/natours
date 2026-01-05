import { showAlert } from './alert';

export const updateSettings = async function (data, type) {
  try {
    const url =
      type === 'password'
        ? `/api/v1/users/updatePassword`
        : `/api/v1/users/updateMe`;
    const res = await fetch(url, {
      method: 'PATCH',
      body: data,
      // headers: {
      //   'content-Type': 'application/json',
      // },
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
