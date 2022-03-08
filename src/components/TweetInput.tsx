import { Avatar, Button, IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth, db, storage } from '../firebase';
import styles from './TweetInput.module.css';
import firebase from 'firebase/app';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState<string>('');

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
    }
    e.target.value = '';
  };

  const sendTweet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let url = '';

    if (tweetImage) {
      const digit = 1000;
      const randomChar =
        new Date().getTime().toString(16) +
        Math.floor(digit * Math.random()).toString(16);
      const fileName = `${randomChar}_${tweetImage.name}`;
      await storage.ref(`images/${fileName}`).put(tweetImage);
      url = await storage.ref('images').child(fileName).getDownloadURL();

      await db.collection('posts').add({
        avatar: user.photoUrl,
        image: url,
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    } else {
      await db.collection('posts').add({
        avatar: user.photoUrl,
        image: '',
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }
    setTweetImage(null);
    setTweetMsg('');
  };
  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={() => auth.signOut()}
          ></Avatar>
          <input
            className={styles.tweet_input}
            placeholder="what's happening"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => {
              setTweetMsg(e.target.value);
            }}
          ></input>
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              ></AddAPhotoIcon>
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              ></input>
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
