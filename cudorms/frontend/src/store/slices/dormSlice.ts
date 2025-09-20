import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface DormAmenities {
  laundry: boolean;
  kitchen: boolean;
  ac: boolean;
  wifi: boolean;
  parking: boolean;
  gym: boolean;
  studyRoom: boolean;
  elevator: boolean;
  petFriendly: boolean;
  other: string[];
}

export interface RoomType {
  type: 'single' | 'double' | 'triple' | 'quad' | 'suite' | 'apartment';
  price: number;
  availability: number;
}

export interface DormReview {
  _id: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Dorm {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  address?: {
    street?: string;
    coordinates?: number[];
  };
  images: string[];
  amenities: DormAmenities;
  capacity?: number;
  roomTypes: RoomType[];
  rating: {
    average: number;
    count: number;
  };
  reviews: DormReview[];
  availability: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  policies?: {
    quietHours?: string;
    guestPolicy?: string;
    petPolicy?: string;
    other?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface DormsResponse {
  dorms: Dorm[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DormState {
  dorms: Dorm[];
  currentDorm: Dorm | null;
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
    search: string;
    year: string;
    minRating: number;
  };
}

const initialState: DormState = {
  dorms: [],
  currentDorm: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    year: '',
    minRating: 0,
  },
};

// Async thunks
export const fetchDorms = createAsyncThunk(
  'dorm/fetchDorms',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    year?: string;
    minRating?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/dorms', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dorms'
      );
    }
  }
);

export const fetchDormById = createAsyncThunk(
  'dorm/fetchDormById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dorms/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dorm'
      );
    }
  }
);

export const addDormReview = createAsyncThunk(
  'dorm/addReview',
  async ({ dormId, review }: {
    dormId: string;
    review: { rating: number; comment?: string };
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/dorms/${dormId}/reviews`, review);
      return { dormId, review: response.data.review, newAverageRating: response.data.newAverageRating };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add review'
      );
    }
  }
);

export const createDorm = createAsyncThunk(
  'dorm/createDorm',
  async (dormData: Partial<Dorm>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/dorms', dormData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create dorm'
      );
    }
  }
);

export const updateDorm = createAsyncThunk(
  'dorm/updateDorm',
  async ({ id, dormData }: {
    id: string;
    dormData: Partial<Dorm>;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/dorms/${id}`, dormData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update dorm'
      );
    }
  }
);

export const deleteDorm = createAsyncThunk(
  'dorm/deleteDorm',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/dorms/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete dorm'
      );
    }
  }
);

const dormSlice = createSlice({
  name: 'dorm',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDorm: (state) => {
      state.currentDorm = null;
    },
    setFilters: (state, action: PayloadAction<Partial<DormState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        year: '',
        minRating: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dorms
      .addCase(fetchDorms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDorms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dorms = action.payload.dorms;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchDorms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Dorm by ID
      .addCase(fetchDormById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDormById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDorm = action.payload;
        state.error = null;
      })
      .addCase(fetchDormById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add Review
      .addCase(addDormReview.fulfilled, (state, action) => {
        const { dormId, review, newAverageRating } = action.payload;
        if (state.currentDorm && state.currentDorm._id === dormId) {
          state.currentDorm.reviews.push(review);
          state.currentDorm.rating.average = newAverageRating;
          state.currentDorm.rating.count += 1;
        }
        
        // Update dorm in list if it exists
        const dormIndex = state.dorms.findIndex(dorm => dorm._id === dormId);
        if (dormIndex !== -1) {
          state.dorms[dormIndex].rating.average = newAverageRating;
          state.dorms[dormIndex].rating.count += 1;
        }
      })
      // Create Dorm
      .addCase(createDorm.fulfilled, (state, action) => {
        state.dorms.unshift(action.payload.dorm);
      })
      // Update Dorm
      .addCase(updateDorm.fulfilled, (state, action) => {
        const updatedDorm = action.payload.dorm;
        const index = state.dorms.findIndex(dorm => dorm._id === updatedDorm._id);
        if (index !== -1) {
          state.dorms[index] = updatedDorm;
        }
        if (state.currentDorm && state.currentDorm._id === updatedDorm._id) {
          state.currentDorm = updatedDorm;
        }
      })
      // Delete Dorm
      .addCase(deleteDorm.fulfilled, (state, action) => {
        state.dorms = state.dorms.filter(dorm => dorm._id !== action.payload);
        if (state.currentDorm && state.currentDorm._id === action.payload) {
          state.currentDorm = null;
        }
      });
  },
});

export const { clearError, clearCurrentDorm, setFilters, clearFilters } = dormSlice.actions;
export default dormSlice.reducer;
