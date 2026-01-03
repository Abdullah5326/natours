export const showAlert = (type, message) => {
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  const el = document.querySelector('.alert');
  setTimeout(() => {
    document.querySelector('body').removeChild(el);
  }, 3000);
};
