import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import TweetInput from './TweetInput';
import styles from './Feed.module.css';
import Post from './Post';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '',
      avatar: '',
      image: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          avatar: doc.data().avatar,
          image: doc.data().image,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
          username: doc.data().username,
        }));
        setPosts(list);
      });
    return () => {
      unSub();
    };
  }, []);

  return (
    <div className={styles.feed}>
      <TweetInput></TweetInput>
      {posts[0]?.id && (
        <>
          {posts.map((post) => (
            <Post key={post.id} post={post}></Post>
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
