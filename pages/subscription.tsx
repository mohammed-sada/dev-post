import React, { useState, useEffect, useContext } from 'react';
import { fetchFromApi } from '../lib/helpers';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import AuthCheck from '../components/AuthCheck';
import { UserContext } from '../lib/contex';
import Loader from '../components/Loader';
import Metatags from '../components/Metatags';

function SubscribeToPlan({ userData }) {
  const proMember =
    userData &&
    userData.activePlans?.find(
      (plan: string) =>
        plan === 'price_1KeiNNCUHvJiVG1c8YC4T3Y2' ||
        plan === 'price_1KeiNrCUHvJiVG1cHCJFAcxh'
    );

  const stripe = useStripe();
  const elements = useElements();

  const [plan, setPlan] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current subscriptions on mount
  useEffect(() => {
    getSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // Fetch current subscriptions from the API
  const getSubscriptions = async () => {
    if (userData) {
      const subs = await fetchFromApi('subscriptions', { method: 'GET' });
      setSubscriptions(subs);
    }
  };

  // Cancel a subscription
  const cancel = async (id) => {
    setLoading(true);
    await fetchFromApi('subscriptions/' + id, { method: 'PATCH' });
    alert('canceled!');
    await getSubscriptions();
    setLoading(false);
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    // Create Payment Method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Create Subscription on the Server
    const subscription = await fetchFromApi('subscriptions', {
      body: {
        plan,
        payment_method: paymentMethod.id,
      },
    });

    // The subscription contains an invoice
    // If the invoice's payment succeeded then you're good,
    // otherwise, the payment intent must be confirmed

    const { latest_invoice } = subscription;

    if (latest_invoice.payment_intent) {
      const { client_secret, status } = latest_invoice.payment_intent;

      if (status === 'requires_action') {
        const { error: confirmationError } = await stripe.confirmCardPayment(
          client_secret
        );
        if (confirmationError) {
          console.error(confirmationError);
          alert('unable to confirm card');
          return;
        }
      }

      // success
      alert('You are subscribed!');
      getSubscriptions();
    }

    setLoading(false);
    setPlan(null);
  };

  return (
    <div className='lg:p-10 px-4 pt-10 min-h-screen bg-gray-200'>
      <div hidden={proMember}>
        <h2 className='mb-10 text-center text-3xl font-bold'>Subscriptions</h2>
        <div className='text-center'>
          <h3 className='text-xl font-semibold mb-3'>Choose a Plan</h3>
          <button
            className={
              'btn w-5/6 ' +
              (plan === 'price_1KeiNNCUHvJiVG1c8YC4T3Y2' ? '' : 'bg-gray-500')
            }
            onClick={() => setPlan('price_1KeiNNCUHvJiVG1c8YC4T3Y2')}
          >
            Basic $25/month
          </button>

          <button
            className={
              'btn mt-4 w-5/6 ' +
              (plan === 'price_1KeiNrCUHvJiVG1cHCJFAcxh' ? '' : 'bg-gray-500')
            }
            onClick={() => setPlan('price_1KeiNrCUHvJiVG1cHCJFAcxh')}
          >
            Pro $50/month
          </button>
        </div>
        <hr />

        <form onSubmit={handleSubmit} className='mt-10' hidden={!plan}>
          <div className='mb-6'>
            <h3 className='text-center text-3xl'>Payment Method</h3>
          </div>

          <CardElement className='py-4' />
          <div className=' flex flex-col justify-center items-center'>
            <button
              className='btn mt-10 bg-green-700'
              type='submit'
              disabled={loading}
            >
              {loading ? <Loader /> : 'Subscribe & Pay'}
            </button>
          </div>
        </form>
      </div>
      <div className='text-center mt-10' hidden={subscriptions.length === 0}>
        <h3 className='text-2xl'>Manage Current Subscription</h3>
        <div>
          {subscriptions.map((sub) => {
            return (
              <div
                key={sub.id}
                className='mt-4 flex flex-col justify-center items-center'
              >
                <h1 className='font-bold text-lg'>Pro Plan</h1>
                <p>
                  Next payment of{' '}
                  <span className='font-bold'>
                    {(sub.plan.amount / 100).toFixed(2)}$
                  </span>{' '}
                  due {new Date(sub.current_period_end * 1000).toUTCString()}
                </p>
                <button
                  className='btn block mt-4 bg-red-700'
                  onClick={() => cancel(sub.id)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Subscriptions() {
  const { userData } = useContext(UserContext);
  return (
    <AuthCheck>
      <Metatags title='Pro' description='Be a Pro member' />
      {userData?.displayName ? (
        <SubscribeToPlan userData={userData} />
      ) : (
        <h2 className='p-10 text-center text-3xl font-semibold'>
          You must sign in using a real account to be a pro member
        </h2>
      )}
    </AuthCheck>
  );
}
