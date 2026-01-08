import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://threads.f8team.dev",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
})

export default {
  /**
   * Lấy danh sách bài post (feed)
   * @param {Object} params
   * @param {"for_you" | "following" | "ghost"} params.type - Loại feed
   * @param {number} [params.page] - Số trang (page-based pagination)
   * @param {number} [params.per_page] - Số lượng posts mỗi trang
   * @param {number} [params.max_id] - ID của post cuối cùng (cursor-based pagination)
   */
  getPosts({ type = "for_you", page = 1, per_page = 10, max_id = null } = {}) {
    console.log(`📤 API getPosts called:`, { type, page, per_page, max_id })

    const params = {
      type,
      per_page,
    }

    // ✅ Ưu tiên cursor-based pagination nếu có max_id
    if (max_id !== null && max_id !== undefined) {
      params.max_id = max_id
      console.log(`Using cursor-based pagination with max_id: ${max_id}`)
    } else {
      params.page = page
      console.log(`Using page-based pagination with page: ${page}`)
    }

    return api
      .get("/api/posts/feed", {
        params: params,
      })
      .then((response) => {
        console.log(`📥 API getPosts response:`, {
          page: params.page || "cursor",
          max_id: params.max_id,
          receivedPosts: response.data?.data?.length || response.data?.length,
          firstPostId: response.data?.data?.[0]?.id,
          lastPostId: response.data?.data?.[response.data.data.length - 1]?.id,
        })
        return response
      })
      .catch((error) => {
        console.error(`❌ API getPosts error:`, error)
        throw error
      })
  },

  /**
   * Toggle like cho một post
   * @param {string|number} postId - ID của post
   */
  toggleLike(postId) {
    console.log(`📤 API toggleLike called for post ${postId}`)
    return api
      .post(`/api/posts/${postId}/like`, {})
      .then((response) => {
        console.log(`📥 API toggleLike response:`, response.data)
        return response
      })
      .catch((error) => {
        console.error(`❌ API toggleLike error:`, error)
        throw error
      })
  },

  /**
   * Tạo post mới
   * @param {Object} postData - Dữ liệu post
   */
  createPost(postData) {
    return api.post("/api/posts", postData)
  },

  /**
   * Xóa post
   * @param {string|number} postId - ID của post
   */
  deletePost(postId) {
    return api.delete(`/api/posts/${postId}`)
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser() {
    return api.get("/api/user")
  },
}
