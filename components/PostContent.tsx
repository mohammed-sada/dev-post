import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { auth } from '../lib/firebase';
import AuthCheck from './AuthCheck';
import CommentForm from './CommentForm';
import Comments from '../components/Comment';

export default function PostContent({ post, postComments }) {
  return (
    <section className='w-full lg:w-5/6 m-5 p-4 lg:p-10 bg-white border border-gray-400'>
      <PostBody post={post} />

      <AuthCheck
        fallback={
          <div className='mt-5 text-center font-bold'>
            <Link href='/enter'>
              <a> 💗 Sign Up to create a comment</a>
            </Link>
          </div>
        }
      >
        <CommentForm post={post} />
      </AuthCheck>

      {postComments?.length > 0 && (
        <Comments postComments={postComments} post={post} />
      )}
    </section>
  );
}

function PostBody({ post }) {
  const { title, username, content, slug, uid } = post;

  const createdAt: Date =
    typeof post.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt.toDate();
  return (
    <>
      <div className='flex justify-between'>
        <h2 className='text-3xl font-semibold capitalize'>{title}</h2>
        {auth?.currentUser?.uid === uid && (
          <Link href={`/admin/${slug}`}>
            <a className='font-bold text-2xl text-white bg-black px-6 py-3 '>
              Edit
            </a>
          </Link>
        )}
      </div>
      <p className='lg:text-xl font-semibold mt-4 mb-10'>
        Written by
        <Link href={`/${username}`}>
          <a className='text-blue-900 italic'> @{username} </a>
        </Link>
        on {createdAt.toISOString().slice(0, 10)}
      </p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </>
  );
}
