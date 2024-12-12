import { useState } from "react";
import { firestore, auth } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import MusicEmbed from "./MusicEmbed"; // Import the MusicEmbed component
import styles from "../styles/AddPost.module.css"; // Import the styles

export default function AddPost({ user }) {
  const [text, setText] = useState("");
  const [musicUrl, setMusicUrl] = useState("");

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(firestore, "posts"), {
        text,
        musicUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setText("");
      setMusicUrl("");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <form onSubmit={handlePostSubmit} className={styles.addPostForm}>
      <textarea
        placeholder="Write your post..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className={styles.postInput}
      />
      <input
        type="url"
        placeholder="Add music URL (YouTube or Spotify)"
        value={musicUrl}
        onChange={(e) => setMusicUrl(e.target.value)}
        className={styles.musicUrlInput}
      />
      <button type="submit" className={styles.postButton}>
        Post
      </button>

      {/* Display the embedded music link */}
      {musicUrl && <MusicEmbed musicUrl={musicUrl} />}
    </form>
  );
}
