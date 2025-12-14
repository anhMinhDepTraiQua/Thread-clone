import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "@/services/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (_, thunkAPI) => {
  try {
    const res = await postsService.getPosts();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    toggleLike(state, action) {
      const id = action.payload;
      const p = state.items.find((x) => x.id === id);
      if (p) {
        p.stats = p.stats || {};
        p.stats.likes = (p.stats.likes || 0) + 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchPosts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });
  },
});

export const { toggleLike } = postsSlice.actions;
export default postsSlice.reducer;
