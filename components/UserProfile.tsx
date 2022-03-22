import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserContext } from '../lib/context';

export default function UserProfile({ user }) {
  const { userData } = useContext(UserContext);
  const proMember =
    userData &&
    userData.activePlans?.find(
      (plan: string) =>
        plan === 'price_1KeiNNCUHvJiVG1c8YC4T3Y2' ||
        plan === 'price_1KeiNrCUHvJiVG1cHCJFAcxh'
    );
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

      <Link href='/subscription'>
        <button className='btn mt-10 text-center text-2xl capitalize'>
          <a>
            {!proMember
              ? 'subscribe and be a Pro member today'
              : 'manage my subscription'}
          </a>
        </button>
      </Link>
    </div>
  );
}
