import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Forum {
  id: number;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  user: {
    id: number;
    username: string;
  };
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  user: {
    id: number;
    username: string;
  };
}

interface ForumState {
  forums: Forum[];
  currentForum: Forum | null;
  loading: boolean;
  error: string | null;
}

const initialState: ForumState = {
  forums: [],
  currentForum: null,
  loading: false,
  error: null,
};

const forumSlice = createSlice({
  name: 'forums',
  initialState,
  reducers: {
    setForums: (state, action: PayloadAction<Forum[]>) => {
      state.forums = action.payload;
    },
    setCurrentForum: (state, action: PayloadAction<Forum>) => {
      state.currentForum = action.payload;
    },
    addForum: (state, action: PayloadAction<Forum>) => {
      state.forums.unshift(action.payload);
    },
    updateForum: (state, action: PayloadAction<Forum>) => {
      const index = state.forums.findIndex(
        (forum) => forum.id === action.payload.id
      );
      if (index !== -1) {
        state.forums[index] = action.payload;
      }
      if (state.currentForum?.id === action.payload.id) {
        state.currentForum = action.payload;
      }
    },
    deleteForum: (state, action: PayloadAction<number>) => {
      state.forums = state.forums.filter((forum) => forum.id !== action.payload);
      if (state.currentForum?.id === action.payload) {
        state.currentForum = null;
      }
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      if (state.currentForum) {
        state.currentForum.comments.unshift(action.payload);
      }
    },
    updateComment: (state, action: PayloadAction<Comment>) => {
      if (state.currentForum) {
        const index = state.currentForum.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.currentForum.comments[index] = action.payload;
        }
      }
    },
    deleteComment: (state, action: PayloadAction<number>) => {
      if (state.currentForum) {
        state.currentForum.comments = state.currentForum.comments.filter(
          (comment) => comment.id !== action.payload
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setForums,
  setCurrentForum,
  addForum,
  updateForum,
  deleteForum,
  addComment,
  updateComment,
  deleteComment,
  setLoading,
  setError,
} = forumSlice.actions;

export default forumSlice.reducer;