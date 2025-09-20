import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchBlogs, setFilters, clearFilters } from '../store/slices/blogSlice';
import { BlogPost } from '../interfaces';

const BlogList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: '',
    dorm: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const { blogs, pagination, isLoading, filters } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      ...filters,
    };
    dispatch(fetchBlogs(params));
  }, [dispatch, currentPage, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      search: '',
      category: '',
      dorm: '',
    });
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  return (
    <div className="blog-list-container">
      <div className="blog-header">
        <h1>CUDorms Blog</h1>
        <p>Stay updated with the latest dorm news, tips, and reviews</p>
      </div>

      {/* Filters */}
      <div className="blog-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={localFilters.search}
              onChange={handleFilterChange}
              placeholder="Search blog posts..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={localFilters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="dorm-specific">Dorm Specific</option>
              <option value="review">Review</option>
              <option value="tips">Tips</option>
              <option value="news">News</option>
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={applyFilters} className="apply-filters">
              Apply Filters
            </button>
            <button onClick={clearAllFilters} className="clear-filters">
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="no-results">
          <h3>No blog posts found</h3>
          <p>Try adjusting your filters or check back later for new posts.</p>
        </div>
      ) : (
        <div className="blog-posts">
          {blogs.map((blog: BlogPost) => (
            <article key={blog._id} className="blog-card">
              {blog.featuredImage && (
                <div className="blog-image">
                  <img src={blog.featuredImage} alt={blog.title} />
                </div>
              )}
              
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-category">
                    {getCategoryIcon(blog.category)} {blog.category.replace('-', ' ')}
                  </span>
                  <span className="blog-date">{formatDate(blog.createdAt)}</span>
                  <span className="blog-author">By {blog.authorName}</span>
                </div>

                <h2 className="blog-title">
                  <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                </h2>

                <p className="blog-excerpt">{blog.excerpt}</p>

                <div className="blog-tags">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="blog-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="blog-stats">
                  <span className="blog-views">👁️ {blog.views} views</span>
                  <span className="blog-likes">❤️ {blog.likes.length} likes</span>
                  <span className="blog-comments">💬 {blog.comments.length} comments</span>
                </div>

                <Link to={`/blogs/${blog._id}`} className="read-more">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="pagination-button"
          >
            Previous
          </button>

          <div className="pagination-info">
            Page {pagination.current} of {pagination.pages}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
