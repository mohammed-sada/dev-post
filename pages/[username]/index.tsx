import React from 'react';
import { getUserDocFromUsername, docToJson } from '../../lib/firebase';

import Posts from '../../components/Posts';
import UserProfile from '../../components/UserProfile';
import Metatags from '../../components/Metatags';

// we will server-render the profile-page as it is public(seo friendly) and it will change as there is always new posts to render(dynamic)
export async function getServerSideProps({ query }) {
  const { username } = query;

  // Get the user profile info via username passed from the url
  const userDoc = await getUserDocFromUsername(username);

  // if username not found => redirect to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    const user = userDoc.data();

    // Get the user's posts
    const collectionRef = userDoc.ref.collection('posts'); // posts collection nested under users collection
    const query = collectionRef
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    const posts = (await query.get()).docs.map(docToJson);

    return {
      props: {
        user,
        posts,
      },
    };
  }
}

export default function ProfilePage({ user, posts }) {
  return (
    <div className='px-10 bg-gray-200 min-h-screen'>
      <Metatags title={user.displayName} image={user.photoURL} />
      <UserProfile user={user} />
      <Posts posts={posts} />
    </div>
  );
}
