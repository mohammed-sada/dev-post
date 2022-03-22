import React, { useContext } from 'react';
import Link from 'next/link';
import { UserContext } from '../lib/context';

export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || (
        <Link href='/enter'>
          <a className='px-10 mt-10 text-center text-2xl flex justify-center'>
            You must be signed in to access this page!
          </a>
        </Link>
      );
}
