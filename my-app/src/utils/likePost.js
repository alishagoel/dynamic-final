import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";

export const likePost = async (postId, userId, currentLikes = []) => {
  const postRef = doc(firestore, "posts", postId);
  if (currentLikes.includes(userId)) {
    await updateDoc(postRef, {
      likes: currentLikes.filter((like) => like !== userId),
    });
  } else {
    await updateDoc(postRef, {
      likes: [...currentLikes, userId],
    });
  }
};
