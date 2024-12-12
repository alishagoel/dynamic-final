import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore, auth } from "../lib/firebase";

const CommentSection = ({
  postId,
  postComments,
  user,
  expandedComments,
  toggleComments,
}) => {
  const [newComment, setNewComment] = useState("");

  // Handle comment submission
  const handleComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await addDoc(collection(firestore, "posts", postId, "comments"), {
          text: newComment,
          createdAt: new Date(),
          userId: user.uid,
        });
        setNewComment(""); // Clear comment input
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      {postComments.length > 0 && (
        <>
          {/* Show only the first comment initially */}
          <div>
            <p>{postComments[0].text}</p>
            <small>
              {postComments[0].createdAt
                ? new Date(
                    postComments[0].createdAt.seconds * 1000
                  ).toLocaleString()
                : "Date unavailable"}
            </small>
          </div>

          {/* Show "Show More Comments" button if there are more comments */}
          {postComments.length > 1 && !expandedComments.has(postId) && (
            <button onClick={() => toggleComments(postId)}>
              Show More Comments
            </button>
          )}

          {/* If expanded, show all comments */}
          {expandedComments.has(postId) &&
            postComments.slice(1).map((comment, index) => (
              <div key={index}>
                <p>{comment.text}</p>
                <small>
                  {comment.createdAt
                    ? new Date(
                        comment.createdAt.seconds * 1000
                      ).toLocaleString()
                    : "Date unavailable"}
                </small>
              </div>
            ))}
        </>
      )}

      {user && (
        <form onSubmit={handleComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          ></textarea>
          <button type="submit">Comment</button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
