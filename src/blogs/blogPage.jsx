import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BlogPage = () => {
  const [blogData, setBlogData] = useState();
  const [coverImage, setCoverImage] = useState();
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { blogId } = useParams();

  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:7000/blog/${blogId}`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
        setTitle(result.blog.title);
        setBlogData(result.blog.createdBy);
        setCommentList(result.comments);
        setCoverImage(result.blog.coverImage);
        setContent(result.blog.content);
        setIsLiked(result.userHasLiked);
        setIsSaved(result.userHasSaved);
        setSaveCount(result.savecount);
        setLikeCount(result.likecount);
        setCommentCount(result.commentcount);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId, commentCount]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await fetch(
        `http://localhost:7000/blog/like/${blogId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        // Add a small visual feedback
        if (!isLiked) {
          const likeBtn = document.getElementById("likeButton");
          likeBtn.classList.add("animate-ping");
          setTimeout(() => likeBtn.classList.remove("animate-ping"), 500);
        }
      }
    } catch (error) {
      console.error("Error liking the blog:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:7000/blog/save/${blogId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        setIsSaved(!isSaved);
        setSaveCount(isSaved ? saveCount - 1 : saveCount + 1);
        // Add a small visual feedback
        if (!isSaved) {
          const saveBtn = document.getElementById("saveButton");
          saveBtn.classList.add("animate-bounce");
          setTimeout(() => saveBtn.classList.remove("animate-bounce"), 1000);
        }
      }
    } catch (error) {
      console.error("Error saving the blog:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (isCommenting || !comment.trim()) return;
    setIsCommenting(true);

    try {
      const response = await fetch(
        `http://localhost:7000/blog/comment/${blogId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: comment }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setCommentList([...commentList, newComment.comment]);
        setCommentCount(commentCount + 1);
        setComment("");
        // Scroll to the new comment
        setTimeout(() => {
          const commentsSection = document.getElementById("commentsSection");
          commentsSection.scrollTop = commentsSection.scrollHeight;
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {title}
          </h1>
          <div className="flex items-center text-sm text-gray-400">
            <span>By {blogData?.fullName}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(blogData?.createdAt)}</span>
          </div>
        </div>

        {/* Cover Image with loading state */}
        {coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden relative">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="animate-pulse rounded-lg w-full h-full bg-gray-700"></div>
              </div>
            )}
            <img
              src={coverImage}
              alt="Blog cover"
              className={`w-full h-auto max-h-96 object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        )}

        {/* Blog Content */}
        <div
          className="prose prose-invert max-w-none mb-8 font-lcase"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>

        {/* Engagement Section */}
        <div className="flex justify-between items-center mb-8 border-t border-b border-gray-700 py-4">
          <button
            id="likeButton"
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isLiked
                ? "text-red-500 bg-red-500 bg-opacity-10"
                : "text-gray-400 hover:bg-gray-800"
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLiking ? (
              <span className="text-xl animate-spin">⏳</span>
            ) : isLiked ? (
              <span className="text-xl">❤️</span>
            ) : (
              <span className="text-xl">🤍</span>
            )}
            <span>
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </span>
          </button>

          <button
            id="saveButton"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isSaved
                ? "text-yellow-500 bg-yellow-500 bg-opacity-10"
                : "text-gray-400 hover:bg-gray-800"
            } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSaving ? (
              <span className="text-xl animate-spin">⏳</span>
            ) : isSaved ? (
              <span className="text-xl">⭐</span>
            ) : (
              <span className="text-xl">☆</span>
            )}
            <span>
              {saveCount} {saveCount === 1 ? "Save" : "Saves"}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Comments ({commentCount})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              name="content"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your thoughts..."
              rows="3"
              required
              disabled={isCommenting}
            ></textarea>
            <button
              type="submit"
              disabled={isCommenting || !comment.trim()}
              className={`mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 ${
                isCommenting || !comment.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isCommenting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Posting...
                </span>
              ) : (
                "Post Comment"
              )}
            </button>
          </form>

          {/* Comments List */}
          <div
            id="commentsSection"
            className="space-y-4 max-h-96 overflow-y-auto pr-2"
          >
            {commentList.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                No comments yet. Be the first to share your thoughts!
              </div>
            ) : (
              commentList.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium text-white">
                      {comment?.user?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {comment?.user?.fullName}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {formatDate(comment?.commentAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 pl-11">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
