import { useState } from 'react';

import { firestore, fromMillis, docToJson } from '../lib/firebase';
import Loader from '../components/Loader';
import Posts from '../components/Posts';
import Metatags from '../components/Metatags';

// we will render this page using ssr because there is always new posts geting uploaded by users (dynamic)
// but when the user clicks to load more posts, we will render them in client-side
const LIMIT = 1;
export async function getServerSideProps() {
  const collectionRef = firestore.collectionGroup('posts');
  const query = collectionRef
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await query.get()).docs.map(docToJson);

  return {
    props: {
      posts,
    },
  };
}

export default function HomePage(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false); // if true => there is no posts in db any more to load

  const getMorePosts = async () => {
    setLoading(true);
    try {
      const lastPost = posts[posts.length - 1];
      const cursor =
        typeof lastPost.createdAt === 'number'
          ? fromMillis(lastPost.createdAt)
          : lastPost.createdAt;

      const collectionRef = firestore.collectionGroup('posts');
      const query = collectionRef
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .startAfter(cursor) // return posts after this date
        .limit(LIMIT);

      const newPosts = (await query.get()).docs.map(docToJson);

      setPosts((prevPosts) => prevPosts.concat(newPosts));
      setLoading(false);

      if (newPosts.length < LIMIT) setPostsEnd(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='bg-gray-200 h-screen'>
      <Metatags title='Feed' />
      <Posts posts={posts} />

      <div className='flex justify-center items-center mt-4'>
        {loading && <Loader />}
        {postsEnd && <p className='font-bold text-xl '>End Game 💀</p>}

        {!loading && !postsEnd && (
          <button
            className='px-6 py-3 bg-black text-white text-2xl font-extralight'
            onClick={getMorePosts}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
