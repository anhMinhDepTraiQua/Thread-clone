// postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:5173/api"; 

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts?page=${page}`);
      return {
        data: response.data.data,
        currentPage: page,
        hasMore: response.data.data.length > 0, // Kiểm tra còn data không
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/like`);
      return { postId, liked: response.data.liked };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: { data: [] },
    status: "idle",
    error: null,
    currentPage: 1,
    hasMore: true,
  },
  reducers: {
    resetPosts: (state) => {
      state.items = { data: [] };
      state.currentPage = 1;
      state.hasMore = true;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Append new posts to existing ones
        state.items.data = [...state.items.data, ...action.payload.data];
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.items.data.find((p) => p.id === action.payload.postId);
        if (post) {
          post.likes_count += action.payload.liked ? 1 : -1;
        }
      });
  },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;