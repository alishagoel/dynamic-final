import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../lib/firebase";

export const addToPlaylist = async (userId, post, playlistName) => {
  try {
    const playlistRef = doc(firestore, "playlists", userId);

    // Update the playlist with the post ID
    await updateDoc(playlistRef, {
      [`${playlistName}`]: arrayUnion(post.id), // Using dynamic field name for playlists
    });
  } catch (error) {
    console.error("Error adding to playlist:", error);
    throw error;
  }
};
