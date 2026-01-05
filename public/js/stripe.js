const stripe = Stripe(
  'pk_test_51Sm4KD2cJuD0TnXne7u7TfFSpSvKCsmC7ZwblX3quc5Hvav4klK7C7hK79XiM1ttzw2zIqvOKumFN0bJrDNeHhA200Ui9JmFRr',
);

export const bookTour = async function (tourId) {
  const res = await fetch(`/api/v1/booking/checkout-session/${tourId}`);

  const data = await res.json();

  stripe.redirectToCheckout({ sessionId: data.session.id });
};
