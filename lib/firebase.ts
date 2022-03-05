import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBGneJlbm2ru_eKiGqPRodhhms2yvH2iyQ',
  authDomain: 'webdev-dac12.firebaseapp.com',
  projectId: 'webdev-dac12',
  storageBucket: 'webdev-dac12.appspot.com',
  messagingSenderId: '261676207601',
  appId: '1:261676207601:web:350f1736423907ff830850',
  measurementId: 'G-9LLY4M8ZB7',
};

// Only initialize once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export async function getUserDocFromUsername(username: string) {
  try {
    const collectionRef = firestore.collection('users');
    const query = collectionRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
  } catch (error) {
    console.error(error);
  }
}

export function postToJson(doc) {
  const post = doc.data();
  const createdAt = post.createdAt.toMillis(); // convert firebase Timestamp to a number
  const updatedAt = post.updatedAt.toMillis();

  return {
    ...post,
    createdAt,
    updatedAt,
  };
}
