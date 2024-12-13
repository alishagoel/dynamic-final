import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CommentSection from "../components/CommentSection";
import AddPost from "../components/AddPost";
import MusicEmbed from "../components/MusicEmbed";
import { likePost } from "../utils/likePost";
import { toggleComments } from "../utils/toggleComments";
import Navbar from "../components/Navbar";
import { FiHeart } from "react-icons/fi";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [usersDisplayNames, setUsersDisplayNames] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    const unsubscribePosts = onSnapshot(
      collection(firestore, "posts"),
      (querySnapshot) => {
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          comments: [],
        }));

        fetchedPosts.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });

        setPosts(fetchedPosts);

        fetchedPosts.forEach((post) => {
          const userId = post.userId;

          if (!usersDisplayNames[userId]) {
            const userRef = doc(firestore, "users", userId);
            getDoc(userRef)
              .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                  setUsersDisplayNames((prevNames) => ({
                    ...prevNames,
                    [userId]: docSnapshot.data().displayName,
                  }));
                }
              })
              .catch((error) => {
                console.error("Error fetching user display name:", error);
              });
          }

          const unsubscribeComments = onSnapshot(
            collection(firestore, "posts", post.id, "comments"),
            (commentSnapshot) => {
              const comments = commentSnapshot.docs.map((doc) => doc.data());
              post.comments = comments;
              setPosts((prevPosts) =>
                prevPosts.map((p) =>
                  p.id === post.id ? { ...p, comments } : p
                )
              );
            }
          );

          return unsubscribeComments;
        });
      }
    );

    return () => unsubscribePosts();
  }, [user, loading, usersDisplayNames]);

  return (
    <div className={styles.homeContainer}>
      <Navbar user={user} />
      <main className={styles.mainContent}>
        {user && <AddPost user={user} />}

        <div className={styles.postsContainer}>
          {posts.length === 0 ? (
            <p className={styles.noPostsMessage}>No posts available.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <h3 className={styles.postUser}>
                    {usersDisplayNames[post.userId] || "Anonymous"}
                  </h3>
                  <small className={styles.postDate}>
                    {post.createdAt
                      ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                      : "Date unavailable"}
                  </small>
                </div>

                <p className={styles.postText}>{post.text}</p>

                {post.musicUrl && <MusicEmbed musicUrl={post.musicUrl} />}

                <div className={styles.likeSection}>
                  <button
                    onClick={() =>
                      likePost(post.id, user?.uid, post.likes || [])
                    }
                    className={styles.likeButton}
                  >
                    <FiHeart
                      className={
                        post.likes && post.likes.includes(user?.uid)
                          ? styles.likedHeart
                          : styles.unlikedHeart
                      }
                    />
                    {post.likes ? post.likes.length : 0}
                  </button>
                </div>

                <div className={styles.commentSection}>
                  <CommentSection
                    postId={post.id}
                    postComments={post.comments}
                    user={user}
                    expandedComments={expandedComments}
                    toggleComments={() =>
                      toggleComments(
                        post.id,
                        expandedComments,
                        setExpandedComments
                      )
                    }
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
