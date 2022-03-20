import '../styles/globals.css';
import 'nprogress/nprogress.css';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { UserContext } from '../lib/contex';
import { useUserData } from '../lib/hooks';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  'pk_test_51KdIKiCUHvJiVG1cfAh6l3jZEfBRInQGKIdOjnlwxAUOfVFfIZlHPAJCM1IUtkN6BntY5aRl3Taj0vJ9foFCCKsQ00Wzp6hkD4'
);

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <Elements stripe={stripePromise}>
      <UserContext.Provider value={userData}>
        <Toaster />
        <Navbar />
        <Component {...pageProps} />
      </UserContext.Provider>
    </Elements>
  );
}

export default MyApp;
