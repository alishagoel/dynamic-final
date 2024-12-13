import { useState } from "react";
import { firestore } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import MusicEmbed from "./MusicEmbed";
import styles from "../styles/AddPost.module.css";

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
        placeholder="Share a song...or some thoughts"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className={styles.postInput}
      />
      <input
        type="url"
        placeholder="Add music URL (YouTube, Spotify or Soundcloud)"
        value={musicUrl}
        onChange={(e) => setMusicUrl(e.target.value)}
        className={styles.musicUrlInput}
      />
      <button type="submit" className={styles.postButton}>
        Post
      </button>

      {musicUrl && <MusicEmbed musicUrl={musicUrl} />}
    </form>
  );
}
