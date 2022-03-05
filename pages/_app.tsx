import '../styles/globals.css';
import 'nprogress/nprogress.css';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { UserContext } from '../lib/contex';
import { useUserData } from '../lib/hooks';

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
    <UserContext.Provider value={userData}>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
