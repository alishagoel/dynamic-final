import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CommentSection from "../components/CommentSection";
import AddPost from "../components/AddPost";
import MusicEmbed from "../components/MusicEmbed";
import { likePost } from "../utils/likePost";
import { toggleComments } from "../utils/toggleComments";
import { deletePost } from "../utils/deletePost";
import Navbar from "../components/Navbar"; // Importing Navbar

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [expandedComments, setExpandedComments] = useState(new Set());
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

        // Sort posts by `createdAt` (latest first)
        fetchedPosts.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0; // Keep order if `createdAt` is missing
        });

        setPosts(fetchedPosts);

        fetchedPosts.forEach((post) => {
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
  }, [user, loading]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      {/* Navbar component */}
      <Navbar user={user} />

      <main style={{ marginTop: "80px", padding: "20px" }}>
        <h1>Welcome to the Social Media App</h1>
        {user && (
          <>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={() => router.push("/profile")}>
              Go to Profile
            </button>
          </>
        )}

        {/* Add Post Component */}
        {user && <AddPost user={user} />}

        <div>
          <h2>Recent Posts</h2>
          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={{ marginBottom: "20px" }}>
                <p>{post.text}</p>
                <small>
                  {post.createdAt
                    ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                    : "Date unavailable"}
                </small>
                <div>
                  <button
                    onClick={() =>
                      likePost(post.id, user.uid, post.likes || [])
                    }
                  >
                    {post.likes && post.likes.includes(user.uid)
                      ? "Unlike"
                      : "Like"}
                  </button>
                  <span>{post.likes ? post.likes.length : 0} likes</span>
                </div>

                {/* Music Embed */}
                <MusicEmbed musicUrl={post.musicUrl} />

                {/* Comment Section */}
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

                {/* Delete Post Button (Only for the current user's posts) */}
                {post.userId === user.uid && (
                  <button onClick={() => deletePost(post.id)}>
                    Delete Post
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
