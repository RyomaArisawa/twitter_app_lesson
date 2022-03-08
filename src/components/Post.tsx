import React, { useState, useEffect } from 'react';
import styles from './Post.module.css';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send';
import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { db } from '../firebase';
import firebase from 'firebase/app';
import { makeStyles } from '@material-ui/core/styles';

interface POSTS {
  post: {
    id: string;
    avatar: string;
    image: string;
    text: string;
    timestamp: any;
    username: string;
  };
}

interface COMMENT {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
}

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<POSTS> = (props) => {
  const { id, avatar, image, text, timestamp, username } = props.post;

  const classes = useStyles();

  const user = useSelector(selectUser);

  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: '',
      avatar: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ]);
  const [openComments, setOpenComments] = useState<boolean>(false);

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .doc(id)
      .collection('comment')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.data().id,
          avatar: doc.data().avatar,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
          username: doc.data().username,
        }));
        setComments(list);
      });
    return () => {
      unSub();
    };
  }, [id]);

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection('posts').doc(id).collection('comment').add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment('');
  };

  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={avatar}></Avatar>
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{username}</span>
              <span className={styles.post_headerTime}>
                {new Date(timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
        </div>
        <div className={styles.post_tweet}>
          <p>{text}</p>
        </div>
        {image && (
          <div className={styles.post_tweetImage}>
            <img src={image} alt="tweet"></img>
          </div>
        )}

        <MessageIcon
          className={styles.post_commentIcon}
          onClick={() => setOpenComments(!openComments)}
        ></MessageIcon>
        {openComments && (
          <>
            {comments.map((com) => (
              <div key={com.id} className={styles.post_comment}>
                <Avatar src={com.avatar} className={classes.small}></Avatar>
                <span className={styles.post_commentUser}>@{com.username}</span>
                <span className={styles.post_commentText}>@{com.text}</span>
                <span className={styles.post_headerTime}>
                  @{new Date(com.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
            ))}

            <form onSubmit={newComment}>
              <div className={styles.post_form}>
                <input
                  className={styles.post_input}
                  type="text"
                  placeholder="Type new comment..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setComment(e.target.value);
                  }}
                ></input>
                <button
                  disabled={!comment}
                  className={
                    comment ? styles.post_button : styles.post_buttonDisable
                  }
                  type="submit"
                >
                  <SendIcon className={styles.post_sendIcon}></SendIcon>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
