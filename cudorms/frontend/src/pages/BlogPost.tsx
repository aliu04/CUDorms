import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchBlogById, likeBlog, addBlogComment } from '../store/slices/blogSlice';
import { addNotification } from '../store/slices/uiSlice';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { currentBlog, isLoading } = useSelector((state: RootState) => state.blog);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [dispatch, id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Please log in to like posts'
      }));
      return;
    }

    if (id) {
      try {
        await dispatch(likeBlog(id)).unwrap();
      } catch (error) {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to like post'
        }));
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Please log in to comment'
      }));
      return;
    }

    if (!newComment.trim()) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Please enter a comment'
      }));
      return;
    }

    if (!id) return;

    setIsSubmittingComment(true);
    try {
      await dispatch(addBlogComment({ id, content: newComment })).unwrap();
      setNewComment('');
      dispatch(addNotification({
        type: 'success',
        message: 'Comment added successfully!'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to add comment'
      }));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      general: '📝',
      'dorm-specific': '🏠',
      review: '⭐',
      tips: '💡',
      news: '📰',
    };
    return icons[category] || '📝';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="error-container">
        <h2>Blog post not found</h2>
        <p>The blog post you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/blogs')} className="back-button">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <div className="blog-post-header">
        <button onClick={() => navigate('/blogs')} className="back-button">
          ← Back to Blog
        </button>

        <div className="blog-meta">
          <span className="blog-category">
            {getCategoryIcon(currentBlog.category)} {currentBlog.category.replace('-', ' ')}
          </span>
          <span className="blog-date">{formatDate(currentBlog.createdAt)}</span>
          <span className="blog-author">By {currentBlog.authorName}</span>
        </div>

        <h1 className="blog-title">{currentBlog.title}</h1>

        <div className="blog-stats">
          <span className="blog-views">👁️ {currentBlog.views} views</span>
          <button 
            onClick={handleLike}
            className={`like-button ${currentBlog.likes.includes(user?.id || '') ? 'liked' : ''}`}
          >
            ❤️ {currentBlog.likes.length} likes
          </button>
        </div>
      </div>

      {currentBlog.featuredImage && (
        <div className="blog-featured-image">
          <img src={currentBlog.featuredImage} alt={currentBlog.title} />
        </div>
      )}

      <div className="blog-content">
        <div className="blog-text">
          {currentBlog.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {currentBlog.tags.length > 0 && (
          <div className="blog-tags">
            {currentBlog.tags.map((tag, index) => (
              <span key={index} className="blog-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments ({currentBlog.comments.length})</h3>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              disabled={isSubmittingComment}
            />
            <button 
              type="submit" 
              disabled={isSubmittingComment || !newComment.trim()}
              className="submit-comment"
            >
              {isSubmittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please <button onClick={() => navigate('/login')}>log in</button> to leave a comment.</p>
          </div>
        )}

        {/* Comments List */}
        <div className="comments-list">
          {currentBlog.comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            currentBlog.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.authorName}</span>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
