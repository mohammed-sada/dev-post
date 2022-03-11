import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { auth, docToJson } from '../lib/firebase';
import AuthCheck from './AuthCheck';
import Comment from '../components/Comment';
import CommentForm from './CommentForm';

export default function PostContent({ post, postComments }) {
  const { title, username, content, slug, uid } = post;
  const createdAt: Date =
    typeof post.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt.toDate();
  return (
    <section className='w-5/6 m-5 p-10 bg-white border border-gray-400'>
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
      <p className='text-xl font-semibold mt-4 mb-10'>
        Written by
        <Link href={`/${username}`}>
          <a className='text-blue-900 italic'> @{username} </a>
        </Link>
        on {createdAt.toISOString().slice(0, 10)}
      </p>
      <ReactMarkdown className='text-2xl'>{content}</ReactMarkdown>

      {/* Comments */}
      {postComments && postComments.length > 0 && (
        <div className='bg-gray-200 p-4 mt-10'>
          <h2 className='mb-5 text-2xl font-bold'>Comments</h2>
          {postComments.map((comment, idx) => {
            return (
              <Comment key={idx} {...comment} postSlug={slug} postUid={uid} />
            );
          })}
        </div>
      )}

      <AuthCheck
        fallback={
          <div className='mt-5 text-center font-bold'>
            <Link href='/enter'>
              <a> 💗 Sign Up to create a comment</a>
            </Link>
          </div>
        }
      >
        <CommentForm postSlug={slug} username={username} postUid={uid} />
      </AuthCheck>
    </section>
  );
}
