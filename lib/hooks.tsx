import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';

export function useUserData() {
  const [user] = useAuthState(auth as any);
  const [currentUserData, setUserData] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time user data subscription
  useEffect(() => {
    let unsubscribe;
    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
        setUserData({ ...doc.data(), uid: doc.id });
        setLoading(false);
      }); // When this user-doc changes, the callback will be triggered to provide the latest data
    } else {
      setUsername(null);
      setLoading(false);
    }

    return unsubscribe; // Unsubscribe to the real time data when this user document is no longer needed to avoid memory leaks
  }, [user]);

  return { user, currentUserData, username, loading };
}
