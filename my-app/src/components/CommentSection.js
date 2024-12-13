import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import styles from "../styles/CommentSection.module.css";

const CommentSection = ({
  postId,
  postComments,
  user,
  expandedComments,
  toggleComments,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await addDoc(collection(firestore, "posts", postId, "comments"), {
          text: newComment,
          createdAt: new Date(),
          userId: user.uid,
          username: user.displayName || "Anonymous",
        });
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentHeader}>Comments</h3>
      <ul className={styles.commentList}>
        {(expandedComments.has(postId)
          ? postComments
          : postComments.slice(0, 1)
        ).map((comment, index) => (
          <li key={index} className={styles.commentItem}>
            <span>
              <span className={styles.commentUser}>
                {comment.username || "Anonymous"}
              </span>
              <span className={styles.commentText}>{comment.text}</span>
            </span>
            <small className={styles.commentDate}>
              {comment.createdAt
                ? new Date(comment.createdAt.seconds * 1000).toLocaleString()
                : "Date unavailable"}
            </small>
          </li>
        ))}
      </ul>

      {postComments.length > 1 && (
        <span
          onClick={() => toggleComments(postId)}
          className={styles.toggleText}
        >
          {expandedComments.has(postId)
            ? "Hide Comments"
            : "Show More Comments"}
        </span>
      )}

      {user && (
        <form onSubmit={handleComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a comment..."
            className={styles.commentTextarea}
          ></textarea>
          <button type="submit" className={styles.commentSubmitButton}>
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
