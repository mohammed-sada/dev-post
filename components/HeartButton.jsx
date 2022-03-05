import React from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { auth, firestore, increment } from '../lib/firebase';

export default function HeartButton({ postRef }) {
  const uid = auth.currentUser.uid;
  const heartRef = postRef.collection('hearts').doc(uid);
  const [heartDoc] = useDocument(heartRef); // Listen to heart document for currently logged in user

  const addHeart = async () => {
    const batch = firestore.batch();

    batch.set(heartRef, { uid });
    batch.update(postRef, { heartCount: increment(1) });

    await batch.commit();
  };
  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.delete(heartRef, { uid });
    batch.update(postRef, { heartCount: increment(-1) });
    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button className='mt-4 p-2 bg-black text-white' onClick={removeHeart}>
      💔 Unheart
    </button>
  ) : (
    <button className='mt-4 p-2 bg-black text-white' onClick={addHeart}>
      💓 Heart
    </button>
  );
}
