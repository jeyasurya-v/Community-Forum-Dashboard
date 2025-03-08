import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import forumReducer from './slices/forumSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forums: forumReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;