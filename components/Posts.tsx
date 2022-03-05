import Link from 'next/link';
import React from 'react';

export default function Posts({ posts, admin = false }) {
  return (
    <div className='pt-10 flex flex-col justify-center items-center'>
      {posts.map((post, idx) => {
        return <Post key={post.slug + idx} post={post} admin={admin} />;
      })}
    </div>
  );
}

function Post({ post, admin }) {
  if (!post) return;

  // Naive method to calc word count and read time
  const wordCount = post.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  const { username, title, slug, heartCount, published } = post;
  return (
    <div className='flex flex-col w-5/6 m-5 p-10 bg-white border border-gray-400'>
      <Link href={`/${username}`}>
        <a className='text-xl font-semibold'>By @{username}</a>
      </Link>

      <Link href={`/${username}/${slug}`}>
        <a className='mt-3 text-2xl font-bold'>{title}</a>
      </Link>

      <footer className='my-4 flex justify-between items-center'>
        <p>
          {wordCount} words. {minutesToRead} min read
        </p>
        {heartCount > 0 && <p>{heartCount} 💗 Hearts</p>}
      </footer>

      {admin && (
        <div>
          <button className='px-6 py-2 bg-black text-white mb-4'>
            <Link href={`/admin/${slug}`}>
              <a>Edit</a>
            </Link>
          </button>
          {published ? (
            <p className='text-green-900 font-bold'>Live</p>
          ) : (
            <p className='text-red-900 font-bold'>Unpublished</p>
          )}
        </div>
      )}
    </div>
  );
}
