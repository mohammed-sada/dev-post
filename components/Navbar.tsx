import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from '../lib/contex';
import { auth } from '../lib/firebase';

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <nav className='px-4 lg:px-32 h-20 text-xs lg:text-xl font-semibold bg-black'>
      <ul className='h-full w-full flex justify-items-between items-center'>
        <div>
          <Link href='/'>
            <li className='text-center py-4 px-3 lg:px-6 bg-white text-black cursor-pointer'>
              <a>Feed</a>
            </li>
          </Link>
        </div>

        {username && (
          <div className='w-full flex justify-end items-center'>
            <li className='mr-6 text-center py-4 px-3 lg:px-6 bg-white text-black  cursor-pointer'>
              <Link href='/admin'>
                <a>Write Posts</a>
              </Link>
            </li>
            <li className='w-1/4'>
              <Link href={`/${username}`}>
                <a>
                  <Image
                    src={user?.photoURL || '/static/photo.png'}
                    alt={username}
                    width='40'
                    height='40'
                  />
                </a>
              </Link>
            </li>
            <li className='mr-6 text-center py-4 px-3 lg:px-6 bg-white text-black cursor-pointer'>
              <button className='font-semibold' onClick={signOut}>
                Log Out
              </button>
            </li>
          </div>
        )}

        {!username && (
          <div className='w-full flex justify-end'>
            <li className='text-center py-4 px-3 lg:px-6 bg-white text-black cursor-pointer'>
              <Link href='/enter'>
                <a>Log in</a>
              </Link>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
}
