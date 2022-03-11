import React, { useState } from 'react';
import { auth, firestore, increment, serverTimestamp } from '../lib/firebase';

export default function CommentForm({ postSlug, username, postUid }) {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (comment.length < 1) return;

      const uid = auth.currentUser.uid;

      const commentRef = firestore
        .collection('users')
        .doc(postUid)
        .collection('posts')
        .doc(postSlug)
        .collection('comments')
        .doc();

      const postRef = firestore
        .collection('users')
        .doc(postUid)
        .collection('posts')
        .doc(postSlug);

      const commentData = {
        content: comment,
        username,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const batch = firestore.batch();
      batch.set(commentRef, commentData);
      batch.update(postRef, { commentCount: increment(1) });

      await batch.commit();

      setComment('');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form className='mt-5' onSubmit={handleSubmit}>
      <div className='pl-6 pr-3 py-3 w-full rounded-full border border-black'>
        <input
          className='w-11/12  outline-none'
          type='text'
          placeholder='Write a commnet...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type='submit' className='w-1/12 font-bold'>
          Submit
        </button>
      </div>
    </form>
  );
}
