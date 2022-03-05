import React from 'react';
import Link from 'next/link';
import Metatags from '../components/Metatags';

export default function Custom404() {
  return (
    <div className='flex flex-col justify-center items-center bg-gray-200 '>
      <Metatags title='404' />

      <div className='my-8 text-center'>
        <h1 className='text-6xl font-extralight'>404</h1>
        <h2 className='text-3xl  mt-4'>Page not found!</h2>
        <div className='text-2xl mt-4 bg-black text-white px-6 py-3'>
          <Link href='/'>
            <a>👈🏻 Back Home</a>
          </Link>
        </div>
      </div>
      <div className='relative w-[355px] h-[355px]'>
        <div className='giphy-embed absolute top-0 w-full h-full z-10 bg-transparent' />
        <iframe
          src='https://giphy.com/embed/YyKPbc5OOTSQE'
          width='350'
          height='350'
          frameBorder='0'
          className='giphy-embed absolute top-0'
          allowFullScreen
        />
      </div>
    </div>
  );
}
