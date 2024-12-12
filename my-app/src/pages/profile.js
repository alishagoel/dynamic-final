import { useState, useEffect } from "react";
import { firestore, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, where, onSnapshot, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { updateProfile } from "firebase/auth";
import CommentSection from "../components/CommentSection";
import AddPost from "../components/AddPost";
import MusicEmbed from "../components/MusicEmbed";
import { deletePost } from "../utils/deletePost";
import { toggleComments } from "../utils/toggleComments";
import styles from "../styles/Profile.module.css"; // Import styles

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    const postsQuery = query(
      collection(firestore, "posts"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        comments: [],
      }));
      setPosts(fetchedPosts);

      fetchedPosts.forEach((post) => {
        const unsubscribeComments = onSnapshot(
          collection(firestore, "posts", post.id, "comments"),
          (commentSnapshot) => {
            const comments = commentSnapshot.docs.map((doc) => doc.data());
            post.comments = comments;
            setPosts((prevPosts) =>
              prevPosts.map((p) => (p.id === post.id ? { ...p, comments } : p))
            );
          }
        );

        return unsubscribeComments;
      });
    });

    return () => unsubscribe();
  }, [user, loading]);

  const handleDisplayNameChange = async () => {
    if (newDisplayName && newDisplayName !== user.displayName) {
      try {
        await updateProfile(user, { displayName: newDisplayName });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating display name:", error.message);
      }
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileHeader}>{user?.displayName}'s Profile</h1>

      {/* Edit Display Name Section */}
      <div className={styles.editDisplayNameContainer}>
        {isEditing ? (
          <div className={styles.editDisplayName}>
            <input
              className={styles.displayNameInput}
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="Enter new display name"
            />
            <button
              className={styles.saveButton}
              onClick={handleDisplayNameChange}
            >
              Save
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className={styles.editButtonContainer}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Edit Display Name
            </button>
          </div>
        )}
      </div>

      <h2 className={styles.postsHeader}>Your Posts</h2>

      {/* Add Post Component (Moved Below Edit Display Name) */}
      {user && <AddPost user={user} />}

      <div className={styles.postsContainer}>
        {posts.length === 0 ? (
          <p className={styles.noPostsMessage}>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div className={styles.postCard} key={post.id}>
              <div className={styles.postHeader}>
                <h3 className={styles.postUser}>{user.displayName}</h3>
                <small className={styles.postDate}>
                  {post.createdAt
                    ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                    : "Date unavailable"}
                </small>
              </div>
              <p className={styles.postText}>{post.text}</p>
              {post.musicUrl && <MusicEmbed musicUrl={post.musicUrl} />}

              {/* Comment Section */}
              <CommentSection
                postId={post.id}
                postComments={post.comments}
                user={user}
                expandedComments={expandedComments}
                toggleComments={() =>
                  toggleComments(post.id, expandedComments, setExpandedComments)
                }
              />

              {/* Delete Post Button */}
              <button
                className={styles.deletePostButton}
                onClick={() => deletePost(post.id, firestore, setPosts)}
              >
                Delete Post
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
