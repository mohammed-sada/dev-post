import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useForm } from 'react-hook-form';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';

import { auth, firestore, serverTimestamp } from '../../lib/firebase';
import AuthCheck from '../../components/AuthCheck';
import Loader from '../../components/Loader';
import ImageUploader from '../../components/ImageUploader';

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const router = useRouter();
  const { slug } = router.query;

  const [preview, setPreview] = useState(false);

  const postRef = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
    .doc(slug);

  const [post] = useDocumentDataOnce(postRef); // We used "once" this time as we are not interested in getting this post data real-time, our purpose in this component is just to preview, edit or delete the post;

  const deletePost = async () => {
    if (confirm('Are You Sure !')) {
      try {
        await postRef.delete();
        toast('Post Annihilated ', { icon: '🗑️' });
        router.push('/admin');
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <main className='p-16 bg-gray-200 min-h-screen flex flex-col lg:flex-row lg:items-start'>
      {post && (
        <>
          <section className='w-3/4 mr-4'>
            <h2 className='mb-2 text-3xl font-extralight capitalize'>
              {post.title}
            </h2>
            <p className='mb-4 text-lg font-semibold'>ID: {post.slug}</p>

            <PostForm
              defaultValues={post}
              postRef={postRef}
              preview={preview}
            />
          </section>

          <aside className='flex flex-col justify-center mt-3 lg:w-1/4 lg:mt-12'>
            <p className='text-lg text-center font-semibold '>Tools</p>
            <button
              className='mt-3 px-6 py-3 text-lg bg-black text-white'
              onClick={() => setPreview((prev) => !prev)}
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
            <button className='my-4 px-6 py-3 text-lg bg-black text-white'>
              <Link href={`/${post.username}/${post.slug}`}>
                <a>View Live</a>
              </Link>
            </button>
            <button
              onClick={deletePost}
              className='px-6 py-3 text-lg bg-red-900 text-white'
            >
              Delete
            </button>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const { isValid, isDirty, errors } = formState; // isDirty: checks if the user is interacting with the form
  const updatePost = async ({ content, published }) => {
    try {
      setLoading(true);
      await postRef.update({
        content,
        published,
        updatedAt: serverTimestamp(),
      });
      reset({ content, published });
      toast.success('Post updated Successfully 🔥');
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <>
      {preview ? (
        <div className='p-4 bg-white w-full min-h-screen'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      ) : (
        <form onSubmit={handleSubmit(updatePost)}>
          <ImageUploader />
          <textarea
            className='h-64 p-4 outline-none text-xl w-full'
            name='content'
            {...register('content', {
              required: { value: true, message: 'Content is required !' },
              maxLength: { value: 20000, message: 'Content is too long !' },
              minLength: { value: 5, message: 'Content is too short !' },
            })}
          />
          {errors.content && (
            <p className='my-3 text-red-900'>{errors.content.message}</p>
          )}

          <fieldset>
            <input
              type='checkbox'
              name='published'
              {...register('published')}
            />
            <label htmlFor='published'> Published</label>
          </fieldset>

          <button
            type='submit'
            className='w-full h-14 flex justify-center items-center my-4 px-6 py-3 text-lg bg-black text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 lg:w-1/2'
            disabled={loading || !isValid || !isDirty}
          >
            {loading ? <Loader /> : 'Save Changes'}
          </button>
        </form>
      )}
    </>
  );
}
