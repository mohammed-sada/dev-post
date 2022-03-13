import React, { useCallback, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import debounce from 'lodash.debounce';

import { UserContext } from '../lib/contex';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import Loader from '../components/Loader';
import Metatags from '../components/Metatags';
import { useRouter } from 'next/router';

export default function EnterPage() {
  const router = useRouter();
  const { user, username, loading } = useContext(UserContext);

  if (loading) {
    return <Loader fullPage />;
  }
  if (username) {
    router.replace('/');
  }
  return (
    <section className='m-10 px-6'>
      <Metatags title='Enter' />
      {!user ? <SignInButton /> : !username && <UsernameForm />}
    </section>
  );
}

function SignInButton() {
  const signIn = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const signInAnonymously = async () => {
    try {
      await auth.signInAnonymously();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <button
        className='text-3xl font-extralight bg-black text-white py-4 px-6 flex justify-between items-center w-2/3'
        onClick={signIn}
      >
        <Image
          src='/static/googleIcon.png'
          alt='google'
          width='30'
          height='30'
        />
        <p className='ml-4 w-full text-center'>Sign In With Google</p>
      </button>
      <button
        className=' mt-4 text-3xl font-extralight bg-black text-white py-4 px-6 flex justify-between items-center w-2/3'
        onClick={signInAnonymously}
      >
        <p className='w-full text-center'> Sign In With Anonymously</p>
      </button>
    </div>
  );
}

function UsernameForm() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    checkUsername(username);
  }, [username]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      // debounce: prevent the excution of this function untill the last event(changing the username input in this case) has stopped firing after a delay of 500ms
      if (username.length >= 3) {
        try {
          const ref = await firestore.doc(`usernames/${username}`).get();
          setIsValid(!ref.exists); // if the username is not taken, then your chosen username is valid
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    }, 500),
    []
  );

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val: string = e.target.value.toLowerCase();
    const reg = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setUsername(val);
      setLoading(false);
      setIsValid(false);
    }
    if (reg.test(val)) {
      setUsername(val);
      setLoading(true);
      setIsValid(true);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create refs for both documents
      const userDoc = firestore.doc(`users/${user.uid}`);
      const usernameDoc = firestore.doc(`usernames/${username}`);

      // Commit both docs together as a batch write.
      const batch = firestore.batch();
      batch.set(userDoc, {
        username,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid }); // reverse mapping

      await batch.commit();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className='m-10'>
      <h3 className='text-5xl font-extralight'>Choose Username</h3>
      <form className='mt-5' onSubmit={onSubmit}>
        <input
          type='text'
          className='mb-3 py-4 px-6 block outline-none bg-black text-white placeholder:font-extralight placeholder:text-white'
          placeholder='Username'
          value={username}
          onChange={onChange}
        />
        <UserMessage loading={loading} isValid={isValid} username={username} />
        <button
          type='submit'
          className='mt-6 py-4 px-6 bg-black text-white cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed'
          disabled={!isValid}
        >
          Choose
        </button>
      </form>
    </section>
  );
}

function UserMessage({ loading, isValid, username }) {
  if (loading) {
    return <Loader />;
  } else if (username.length > 3 && !isValid) {
    return <p className='text-red-900'>{username} is taken!</p>;
  } else if (isValid) {
    return <p className='text-green-900'>{username} is available!</p>;
  } else {
    return <p></p>;
  }
}
