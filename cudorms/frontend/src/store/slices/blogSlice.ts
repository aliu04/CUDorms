import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface BlogComment {
  _id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorName: string;
  dorm?: string;
  tags: string[];
  featuredImage?: string;
  isPublished: boolean;
  views: number;
  likes: string[];
  comments: BlogComment[];
  category: 'general' | 'dorm-specific' | 'review' | 'tips' | 'news';
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  blogs: BlogPost[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BlogState {
  blogs: BlogPost[];
  currentBlog: BlogPost | null;
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    search: string;
    dorm: string;
  };
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    search: '',
    dorm: '',
  },
};

// Async thunks
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    dorm?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/blogs', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch blogs'
      );
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/blogs/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch blog'
      );
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData: {
    title: string;
    content: string;
    excerpt?: string;
    dorm?: string;
    tags?: string[];
    featuredImage?: string;
    category?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/blogs', blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create blog'
      );
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, blogData }: {
    id: string;
    blogData: {
      title?: string;
      content?: string;
      excerpt?: string;
      dorm?: string;
      tags?: string[];
      featuredImage?: string;
      category?: string;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update blog'
      );
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/blogs/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete blog'
      );
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blog/likeBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/blogs/${id}/like`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like blog'
      );
    }
  }
);

export const addBlogComment = createAsyncThunk(
  'blog/addComment',
  async ({ id, content }: {
    id: string;
    content: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/blogs/${id}/comments`, { content });
      return { id, comment: response.data.comment };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add comment'
      );
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    setFilters: (state, action: PayloadAction<Partial<BlogState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        search: '',
        dorm: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload.blog);
      })
      // Update Blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updatedBlog = action.payload.blog;
        const index = state.blogs.findIndex(blog => blog._id === updatedBlog._id);
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
        }
        if (state.currentBlog && state.currentBlog._id === updatedBlog._id) {
          state.currentBlog = updatedBlog;
        }
      })
      // Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        if (state.currentBlog && state.currentBlog._id === action.payload) {
          state.currentBlog = null;
        }
      })
      // Like Blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        const { id, likeCount, isLiked } = action.payload;
        
        // Update in blogs list
        const blogIndex = state.blogs.findIndex(blog => blog._id === id);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].likes = isLiked 
            ? [...state.blogs[blogIndex].likes, 'current-user'] // Placeholder for current user ID
            : state.blogs[blogIndex].likes.filter(like => like !== 'current-user');
        }
        
        // Update current blog
        if (state.currentBlog && state.currentBlog._id === id) {
          state.currentBlog.likes = isLiked 
            ? [...state.currentBlog.likes, 'current-user']
            : state.currentBlog.likes.filter(like => like !== 'current-user');
        }
      })
      // Add Comment
      .addCase(addBlogComment.fulfilled, (state, action) => {
        const { id, comment } = action.payload;
        
        // Update current blog
        if (state.currentBlog && state.currentBlog._id === id) {
          state.currentBlog.comments.push(comment);
        }
        
        // Update in blogs list
        const blogIndex = state.blogs.findIndex(blog => blog._id === id);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].comments.push(comment);
        }
      });
  },
});

export const { clearError, clearCurrentBlog, setFilters, clearFilters } = blogSlice.actions;
export default blogSlice.reducer;
