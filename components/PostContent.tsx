import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { auth } from '../lib/firebase';

export default function PostContent({ post }) {
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
          <a className='text-blue-900'> @{username} </a>
        </Link>
        on {createdAt.toISOString().slice(0, 10)}
      </p>
      <ReactMarkdown className='text-2xl'>{content}</ReactMarkdown>
    </section>
  );
}
