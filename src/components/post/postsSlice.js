import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "@/services/posts";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page = 1, thunkAPI) => {
    try {
      const res = await postsService.getPosts(page);
      
      console.log(`fetchPosts thunk - Raw response for page ${page}:`, res.data);
      
      // Xử lý response data
      let data = res.data?.data || res.data;
      
      return {
        data: data,
        page,
        hasMore: Array.isArray(data) ? data.length > 0 : false,
      };
    } catch (err) {
      console.error("fetchPosts error:", err);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, thunkAPI) => {
    try {
      // Call API
      const response = await postsService.toggleLike(postId);
      
      console.log(`toggleLike API response for post ${postId}:`, response.data);
      
      return { 
        postId,
        // API có thể trả về trạng thái mới
        isLiked: response.data?.is_liked,
        likesCount: response.data?.likes_count
      };
    } catch (err) {
      console.error("toggleLike API error:", err);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: { data: [] },
    status: "idle",
    error: null,
    currentPage: 0,
    hasMore: true,
    consecutiveDuplicates: 0, // Đếm số lần liên tiếp gặp duplicate
    maxDuplicateRetries: 3,   // Tối đa thử 3 lần khi gặp duplicate
  },
  reducers: {
    resetPosts(state) {
      state.items = { data: [] };
      state.status = "idle";
      state.currentPage = 0;
      state.hasMore = true;
      state.error = null;
      state.consecutiveDuplicates = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        console.log("fetchPosts.fulfilled - Before update:", {
          currentPage: state.currentPage,
          newPage: action.payload.page,
          newPostsCount: (action.payload.data || []).length
        });
        
        state.status = "succeeded";
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
        
        const newPosts = action.payload.data || [];
        
        // Log IDs của posts mới để debug
        console.log(`Page ${action.payload.page} post IDs:`, 
          newPosts.slice(0, 5).map(p => p.id)
        );
        
        // Nếu là page đầu tiên, thay thế toàn bộ
        if (action.payload.page === 1) {
          state.items.data = newPosts;
          console.log("Loaded page 1 with", newPosts.length, "posts");
        } else {
          // Log existing IDs
          console.log("Existing post IDs:", 
            state.items.data.slice(0, 5).map(p => p.id)
          );
          
          // Lọc bỏ các post bị duplicate dựa trên ID
          const existingIds = new Set(state.items.data.map(p => p.id));
          const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
          
          console.log(`Duplicates found: ${newPosts.length - uniqueNewPosts.length}`);
          console.log("Unique new post IDs:", uniqueNewPosts.map(p => p.id));
          
          // Nếu có posts mới unique, reset counter và append
          if (uniqueNewPosts.length > 0) {
            state.items.data = [...state.items.data, ...uniqueNewPosts];
            state.consecutiveDuplicates = 0; // Reset counter
            console.log(`Page ${action.payload.page}: Added ${uniqueNewPosts.length} new posts. Total: ${state.items.data.length}`);
          } else {
            // Tất cả đều duplicate, tăng counter
            state.consecutiveDuplicates += 1;
            console.warn(`All posts are duplicates (attempt ${state.consecutiveDuplicates}/${state.maxDuplicateRetries})`);
          }
          
          // Dừng lại nếu:
          // 1. API trả về ít hơn per_page items (hết data thật sự)
          // 2. Đã thử quá nhiều lần với duplicate
          if (newPosts.length < 10) {
            state.hasMore = false;
            console.log("No more posts available (API returned less than per_page)");
          } else if (state.consecutiveDuplicates >= state.maxDuplicateRetries) {
            state.hasMore = false;
            console.error(`Stopped after ${state.consecutiveDuplicates} consecutive duplicate pages. Backend pagination may be broken.`);
          }
        }
        
        console.log("fetchPosts.fulfilled - After update:", {
          currentPage: state.currentPage,
          hasMore: state.hasMore,
          totalPosts: state.items.data.length
        });
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Toggle like
      .addCase(toggleLike.pending, (state, action) => {
        // Không cần làm gì vì optimistic update đã xử lý ở component
        console.log("toggleLike.pending:", action.meta.arg);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, isLiked, likesCount } = action.payload;
        const post = state.items.data?.find((p) => p.id === postId);
        
        if (post) {
          // Sync với data từ server (nếu có)
          if (isLiked !== undefined) {
            post.is_liked = isLiked;
          }
          if (likesCount !== undefined) {
            post.likes_count = likesCount;
          }
          
          console.log(`toggleLike.fulfilled: Post ${postId} synced with server`);
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        console.error("toggleLike.rejected:", action.payload);
        // Không cần làm gì vì rollback đã xử lý ở component
      });
  },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;