import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * User interface representing authenticated user data
 */
interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * Authentication state interface
 * Manages user session state and initialization status
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

/**
 * Initial authentication state
 * All users start as unauthenticated until verified
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false
};

/**
 * Authentication slice for Redux store
 * Handles all authentication-related state changes
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set user credentials after successful login/registration
     * Stores token in localStorage and updates auth state
     */
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },

    /**
     * Clear user session on logout
     * Removes token from localStorage and resets auth state
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      localStorage.removeItem("token");
    },

    /**
     * Restore user session from existing token
     * Used when rehydrating state after page refresh
     */
    restoreSession: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },

    /**
     * Mark authentication as initialized
     * Ensures proper loading states and auth checks
     */
    setInitialized: (state) => {
      state.isInitialized = true;
      if (!localStorage.getItem("token")) {
        state.isAuthenticated = false;
        state.user = null;
      }
    }
  },
});

export const { setCredentials, logout, restoreSession, setInitialized } = authSlice.actions;
export default authSlice.reducer;