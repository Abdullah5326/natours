import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.status === 'success') {
      showAlert('success', 'You logged in successfully');

      window.setTimeout(() => {
        window.location.replace('/');
      }, 1500);
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};

export const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout');
    const data = await res.json();
    if (data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Log out error!Please try again');
  }
};
