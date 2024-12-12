export const toggleComments = (
  postId,
  expandedComments,
  setExpandedComments
) => {
  setExpandedComments((prevState) => {
    const newExpandedComments = new Set(prevState);
    if (newExpandedComments.has(postId)) {
      newExpandedComments.delete(postId);
    } else {
      newExpandedComments.add(postId);
    }
    return newExpandedComments;
  });
};
