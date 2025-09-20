import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dormReducer from './slices/dormSlice';
import blogReducer from './slices/blogSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dorm: dormReducer,
    blog: blogReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
