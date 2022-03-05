import React, { useContext, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import kebabcase from 'lodash.kebabcase';

import { auth, firestore, serverTimestamp } from '../../lib/firebase';
import AuthCheck from '../../components/AuthCheck';
import Posts from '../../components/Posts';
import Metatags from '../../components/Metatags';
import { UserContext } from '../../lib/contex';
import { useRouter } from 'next/router';

export default function AdminPostsPage() {
  return (
    <>
      <AuthCheck>
        <Metatags title='Dashboard' />
        <PostsList />
        <CreatePost />
      </AuthCheck>
    </>
  );
}

function PostsList() {
  const query = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
    .orderBy('createdAt', 'desc');
  const [posts] = useCollectionData(query);
  return <Posts posts={posts || []} admin />;
}

function CreatePost() {
  const router = useRouter();
  const { username } = useContext(UserContext);

  const [title, setTitle] = useState('');

  const valid = title.length > 3 && title.length < 100;
  const slug = encodeURI(kebabcase(title)); // encodeURI remove symbols (!#@...) from slug

  const createPost = async (e) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug);

    const postData = {
      title,
      slug,
      username,
      uid,
      content: '# Hello World!',
      published: false,
      heartCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await ref.set(postData);

    router.push(`/admin/${slug}`);
  };
  return (
    <>
      <form
        className='mx-20 mt-10 flex flex-col justify-center items-start'
        onSubmit={createPost}
      >
        <h1 className='capitalize mb-10 text-4xl text-center'>
          create a new post !
        </h1>
        <input
          type='text'
          placeholder='My Article'
          className='border border-black outline-none px-8 py-4 text-2xl'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type='submit'
          className='my-4 text-xl bg-black text-white px-6 py-3 cursor-pointer disabled:cursor-default disabled:opacity-70'
          disabled={!valid}
        >
          Create
        </button>
        {slug && (
          <p className='mb-4 text-green-900 text-lg font-semibold'>
            Slug: {slug}
          </p>
        )}
      </form>
    </>
  );
}
