import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';

export function useUserData() {
  const [user] = useAuthState(auth as any);
  const [username, setUsername] = useState(null);

  // Real-time user data subscription
  useEffect(() => {
    let unsubscribe;
    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => setUsername(doc.data()?.username)); // When this user-doc changes, the callback will be triggered to provide the latest data
    } else {
      setUsername(null);
    }

    return unsubscribe; // Unsubscribe to the real time data when this user document is no longer needed to avoid memory leaks
  }, [user]);

  return { user, username };
}
