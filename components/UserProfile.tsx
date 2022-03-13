import Image from 'next/image';
import React from 'react';

export default function UserProfile({ user }) {
  return (
    <div className='text-center pt-10 flex flex-col justify-center items-center '>
      <Image
        src={user.photoURL || '/static/photo.png'}
        alt={user.displayName}
        height='100'
        width='100'
      />
      <p className=' mt-2 text-xl italic'>@{user.username}</p>
      <h1 className='mt-8 text-3xl lg:text-4xl font-bold capitalize'>
        {user.displayName}
      </h1>
    </div>
  );
}
