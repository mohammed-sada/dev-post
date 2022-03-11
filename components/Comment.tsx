import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { auth, firestore, increment, serverTimestamp } from '../lib/firebase';
import toast from 'react-hot-toast';

export default function Comment({
  username,
  content,
  createdAt,
  postUid,
  id: commentId,
  postSlug,
  uid, // id of the user who commented this comment
}) {
  createdAt =
    typeof createdAt === 'number' ? new Date(createdAt) : createdAt?.toDate();

  const [editMode, setEditMode] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editMode) {
      inputRef.current && inputRef.current.focus();
    }
  }, [editMode]);

  const deleteComment = async () => {
    try {
      const batch = firestore.batch();
      const commentRef = await firestore
        .collection('users')
        .doc(postUid) // id of the user who posted that post
        .collection('posts')
        .doc(postSlug) // id of the post
        .collection('comments')
        .doc(commentId); // id of the comment

      const postRef = firestore
        .collection('users')
        .doc(postUid)
        .collection('posts')
        .doc(postSlug);

      batch.delete(commentRef);
      batch.update(postRef, {
        commentCount: increment(-1),
      });
      await batch.commit();
      toast.success('Comment Terminated ⚛');
    } catch (error) {
      console.error(error);
    }
  };

  const updateComment = async () => {
    setEditMode((prev) => !prev);

    if (editMode) {
      try {
        const ref = await firestore
          .collection('users')
          .doc(postUid)
          .collection('posts')
          .doc(postSlug)
          .collection('comments')
          .doc(commentId);
        await ref.update({ content: newContent, updatedAt: serverTimestamp() });
        toast.success('Comment Updated 🙃');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className='mb-4 border border-black p-4 flex justify-between items-center'>
      <div>
        <Link href={`/${username}`}>
          <a className='text-blue-900 italic font-bold'>@{username}</a>
        </Link>
        {!editMode ? (
          <h4 className='text-xl leading-5 my-1'>{newContent}</h4>
        ) : (
          <input
            ref={inputRef}
            type='text'
            className='block bg-transparent text-xl leading-5 my-1 border border-black'
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
        )}
        <p className='text-sm text-gray-500'>
          {createdAt && createdAt.toISOString().slice(0, 10)}
        </p>
      </div>

      {auth?.currentUser?.uid === uid && (
        <div>
          <button className='btn text-lg py-2 px-4' onClick={deleteComment}>
            Delete
          </button>
          <button
            className='btn text-lg py-2 px-4 mx-2'
            onClick={updateComment}
          >
            {editMode ? 'Submit' : 'Edit'}
          </button>
          {editMode && (
            <button
              className='btn text-lg py-2 px-4'
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}