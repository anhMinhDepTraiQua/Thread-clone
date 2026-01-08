import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import postService from "@/services/posts"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api"

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async ({ page = 1, maxId = null }, thunkAPI) => {
  try {
    console.log(`🔄 fetchPosts thunk called with page: ${page}, maxId: ${maxId}`)

    const res = await postService.getPosts(page, 10, "for_you", maxId)

    console.log(`✅ fetchPosts response:`, {
      page,
      maxId,
      receivedPosts: res.data?.data?.length || res.data?.length,
      fullResponse: res.data,
    })

    let data = res.data?.data || res.data

    if (!Array.isArray(data)) {
      data = []
    }

    const hasMore = data.length === 10

    console.log(`📊 hasMore decision:`, {
      receivedCount: data.length,
      expectedCount: 10,
      hasMore: hasMore,
    })

    return {
      data: data,
      page: page,
      hasMore: hasMore,
    }
  } catch (err) {
    console.error("❌ fetchPosts error:", err)
    return thunkAPI.rejectWithValue(err.response?.data || err.message)
  }
})

export const toggleLike = createAsyncThunk("posts/toggleLike", async (postId, thunkAPI) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    console.log(`🔄 toggleLike API request for post ${postId}`)

    const response = await axios.post(
      `${API_BASE_URL}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    console.log(`✅ toggleLike success for post ${postId}:`, response.data)

    return {
      postId,
      isLiked: response.data?.is_liked,
      likesCount: response.data?.likes_count,
    }
  } catch (err) {
    console.error("❌ toggleLike error:", err)
    return thunkAPI.rejectWithValue(err.response?.data || err.message)
  }
})

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: { data: [] },
    status: "idle",
    error: null,
    currentPage: 0,
    hasMore: true,
  },
  reducers: {
    resetPosts(state) {
      state.items = { data: [] }
      state.status = "idle"
      state.currentPage = 0
      state.hasMore = true
      state.error = null
      console.log("🔄 Posts reset")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"
        console.log("⏳ fetchPosts.pending")
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { page, data, hasMore: apiHasMore } = action.payload

        console.log("✅ fetchPosts.fulfilled:", {
          oldCurrentPage: state.currentPage,
          newPage: page,
          newPostsCount: data.length,
          apiHasMore,
          oldHasMore: state.hasMore,
        })

        state.status = "succeeded"
        state.currentPage = Number(page)

        console.log("✅ After update currentPage:", state.currentPage, typeof state.currentPage)

        if (page === 1) {
          // Page 1: Replace all posts
          state.items.data = data
          state.hasMore = apiHasMore
          console.log(`📄 Loaded page 1 with ${data.length} posts`)
        } else {
          // Page > 1: Append and remove duplicates
          const existingIds = new Set(state.items.data.map((p) => p.id))
          const uniqueNewPosts = data.filter((p) => !existingIds.has(p.id))

          if (uniqueNewPosts.length > 0) {
            state.items.data = [...state.items.data, ...uniqueNewPosts]
            state.hasMore = apiHasMore
            console.log(`➕ Page ${page}: Added ${uniqueNewPosts.length} new posts. Total: ${state.items.data.length}`)
          } else {
            console.warn(
              `⚠️ Page ${page}: All ${data.length} posts are duplicates - Setting hasMore=false to stop infinite loop`,
            )
            state.hasMore = false
          }
        }

        console.log("📊 State after update:", {
          currentPage: state.currentPage,
          hasMore: state.hasMore,
          totalPosts: state.items.data.length,
        })
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
        console.error("❌ fetchPosts.rejected:", action.payload)
      })
      .addCase(toggleLike.pending, (state, action) => {
        console.log("⏳ toggleLike.pending:", action.meta.arg)
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, isLiked, likesCount } = action.payload
        const post = state.items.data?.find((p) => p.id === postId)

        if (post) {
          if (isLiked !== undefined) {
            post.is_liked = isLiked
          }
          if (likesCount !== undefined) {
            post.likes_count = likesCount
          }

          console.log(`✅ toggleLike.fulfilled: Post ${postId} updated`, {
            isLiked: post.is_liked,
            likesCount: post.likes_count,
          })
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        console.error("❌ toggleLike.rejected:", action.payload)
      })
  },
})

export const { resetPosts } = postsSlice.actions
export default postsSlice.reducer
