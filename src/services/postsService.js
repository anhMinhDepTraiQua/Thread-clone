import api from "@/services/index"; // ✅ Import từ index.js

const postsService = {
  /**
   * Lấy danh sách posts với pagination
   * @param {number} page - Số trang cần lấy
   * @param {number} perPage - Số lượng posts mỗi trang
   * @param {string} type - Loại feed (for_you, following, etc.)
   * @param {number} maxId - ID của post cuối cùng (cursor-based pagination)
   * @returns {Promise} Response data
   */
  getPosts: async (page = 1, perPage = 10, type = "for_you", maxId = null) => {
    try {
      console.log(`📤 postsService.getPosts:`, { page, perPage, type, maxId });
      
      // ✅ Gọi API từ index.js với params đúng format
      const response = await api.getPosts({
        type,
        page,
        per_page: perPage,
        max_id: maxId,
      });
      
      console.log(`📥 postsService.getPosts response:`, {
        postCount: response.data?.data?.length || response.data?.length,
        firstPostId: response.data?.data?.[0]?.id,
        lastPostId: response.data?.data?.[response.data.data?.length - 1]?.id,
      });
      
      return response;
    } catch (error) {
      console.error("❌ postsService.getPosts error:", error);
      throw error;
    }
  },

  /**
   * Toggle like cho một post
   * @param {string|number} postId - ID của post
   * @returns {Promise} Response data
   */
  toggleLike: async (postId) => {
    try {
      console.log(`📤 postsService.toggleLike for post ${postId}`);
      const response = await api.toggleLike(postId);
      console.log(`📥 postsService.toggleLike response:`, response.data);
      return response;
    } catch (error) {
      console.error(`❌ postsService.toggleLike error:`, error);
      throw error;
    }
  },

  /**
   * Tạo post mới
   * @param {Object} postData - Dữ liệu post
   * @returns {Promise} Response data
   */
  createPost: async (postData) => {
    try {
      const response = await api.createPost(postData);
      return response;
    } catch (error) {
      console.error("❌ postsService.createPost error:", error);
      throw error;
    }
  },

  /**
   * Xóa post
   * @param {string|number} postId - ID của post
   * @returns {Promise} Response data
   */
  deletePost: async (postId) => {
    try {
      const response = await api.deletePost(postId);
      return response;
    } catch (error) {
      console.error("❌ postsService.deletePost error:", error);
      throw error;
    }
  },
};

export default postsService;