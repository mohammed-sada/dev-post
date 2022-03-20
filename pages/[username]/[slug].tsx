import React, { useContext } from 'react';
import Link from 'next/link';

import { useDocumentData, useCollection } from 'react-firebase-hooks/firestore';

import Metatags from '../../components/Metatags';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import {
  firestore,
  getUserDocFromUsername,
  docToJson,
} from '../../lib/firebase';
import { UserContext } from '../../lib/contex';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserDocFromUsername(username);
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  const postDoc = userDoc.ref.collection('posts').doc(slug);
  let post = await postDoc.get();
  if (!post.exists) {
    return {
      notFound: true,
    };
  }

  post = docToJson(post);
  const postPath = postDoc.path;
  const commentsPath = postDoc.collection('comments').path;
  return {
    props: {
      userDoc: userDoc.data(),
      post,
      postPath,
      commentsPath,
    },
    revalidate: 5000, // re-generate this post on the server when new req comes in, but only do so in a certain time intervals => every 5sec(in this case)
  };
}

export async function getStaticPaths() {
  const posts = await firestore.collectionGroup('posts').get(); // snapshot of the posts
  const paths = posts.docs.map((doc) => {
    const { username, slug } = doc.data();
    return { params: { username, slug } };
  });

  return {
    paths,
    fallback: 'blocking',
  };
  // When fallback is set to blocking, next will switch to ssr when there is no a pre-rendered post in the CDN,
  // And that's awesome as when adding a new post, first time it will be ssr, then it will be cached, without needing to redeploy the site.
}

export default function PostPage(props) {
  const postRef = firestore.doc(props.postPath);
  const commentsRef = firestore.collection(props.commentsPath);

  // @ts-ignore:next-line
  const [realTimePost] = useDocumentData(postRef); // Retrieve and monitor a document value in Cloud Firestore. this hook will get a feed of the post data in real-time
  // @ts-ignore:next-line
  const [realTimeComments] = useCollection(commentsRef);
  const postComments = realTimeComments?.docs.map((comment) =>
    docToJson(comment, comment.id)
  );

  const post = realTimePost || props.post; // When realTimePost data is not fetched yet, fallback to the ssr data

  return (
    <div className='bg-gray-200 min-h-screen p-2 lg:p-10'>
      <Metatags title={post.title} description={post.content} />

      <div className='flex flex-col justify-center items-center lg:flex-row '>
        <PostContent post={post} postComments={postComments} />

        <aside className='w-full lg:w-1/6 mt-4 p-10 border border-gray-400 bg-white flex flex-col justify-center items-center'>
          {post.heartCount > 0 && (
            <p className='text-4xl'>{post.heartCount} ♥</p>
          )}

          <AuthCheck
            fallback={
              <Link href='/enter'>
                <a> 💗 Sign Up</a>
              </Link>
            }
          >
            <HeartButton postRef={postRef} />
          </AuthCheck>
        </aside>
      </div>
    </div>
  );
}
