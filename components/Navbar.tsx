import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from '../lib/contex';

export default function Navbar() {
  const { user, username } = useContext(UserContext);
  return (
    <nav className='px-32 h-20 text-xl bg-black'>
      <ul className='h-full w-full flex justify-items-between items-center'>
        <div className='w-1/2 flex justify-start'>
          <Link href='/'>
            <li className=' text-center py-4 px-6 bg-white text-black cursor-pointer'>
              <a>Feed</a>
            </li>
          </Link>
        </div>

        {username && (
          <div className='w-1/2 flex justify-end items-center'>
            <li className='mr-6 text-center py-4 px-6 bg-white text-black  cursor-pointer'>
              <Link href='/admin'>
                <a>Write Posts</a>
              </Link>
            </li>
            <li className='w-1/4'>
              <Link href={`/${username}`}>
                <a>
                  <Image
                    src={user?.photoURL || '/static/photo.png'}
                    alt={'asd'}
                    width='40'
                    height='40'
                  />
                </a>
              </Link>
            </li>
          </div>
        )}

        {!username && (
          <div className=' w-1/2 flex justify-end'>
            <li className='w-1/4 text-center py-4 px-6 bg-white text-black cursor-pointer'>
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
