import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";

export const deletePost = async (postId) => {
  const postRef = doc(firestore, "posts", postId);
  try {
    await deleteDoc(postRef);
    alert("Post deleted successfully!");
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};
