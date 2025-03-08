import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Authentication System Overview
 * 
 * This slice manages the authentication state for the entire application.
 * Key Features:
 * 1. Token Management: JWT stored in localStorage for persistence
 * 2. User State: Current user data maintained in Redux
 * 3. Authentication Status: Tracks login state and initialization
 * 4. Session Restoration: Handles page refresh and token validation
 */

/**
 * User Interface
 * Defines the structure of authenticated user data
 * - id: Unique identifier
 * - username: Display name
 * - email: User's email address
 */
interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * Authentication State Interface
 * Manages the complete authentication state
 * - user: Current user data (null if not authenticated)
 * - isAuthenticated: Boolean flag for auth status
 * - isInitialized: Ensures auth system is ready
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

/**
 * Initial Authentication State
 * Default state when application loads
 * - All users start as unauthenticated
 * - System begins in uninitialized state
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false
};

/**
 * Authentication Slice
 * Manages all authentication-related state changes
 * 
 * Key Actions:
 * - setCredentials: Sets up new authenticated session
 * - logout: Cleans up user session
 * - restoreSession: Rehydrates state after page refresh
 * - setInitialized: Marks auth system as ready
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set User Credentials
     * Called after successful login/registration
     * - Updates user data
     * - Marks as authenticated
     * - Stores token in localStorage
     */
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
      // localStorage.setItem("token", action.payload.token);
    },

    /**
     * Logout User
     * Cleans up the authenticated session
     * - Clears user data
     * - Removes token from localStorage
     * - Resets authentication state
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      localStorage.removeItem("token");
    },

    /**
     * Restore User Session
     * Called when rehydrating state (e.g., after page refresh)
     * - Restores user data from validated token
     * - Maintains authentication state
     */
    restoreSession: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },

    /**
     * Set Initialization Status
     * Marks the authentication system as ready
     * - Checks token presence
     * - Updates authentication state accordingly
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