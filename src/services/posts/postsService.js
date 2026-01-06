import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const postsService = {
  /**
   * Lấy danh sách posts với pagination
   * @param {number} page - Số trang cần lấy (fallback)
   * @param {number} perPage - Số lượng posts mỗi trang
   * @param {string} type - Loại feed (for_you, following, etc.)
   * @param {number} maxId - ID của post cuối cùng (cursor-based pagination)
   * @returns {Promise} Response data
   */
  getPosts: async (page = 1, perPage = 10, type = "for_you", maxId = null) => {
    try {
      const token = localStorage.getItem("token");
      
      console.log(`API Request: Fetching posts`, { page, perPage, maxId });
      
      const params = { 
        type,
        per_page: perPage,
        sort: 'created_at',
        order: 'desc',
      };

      // Ưu tiên cursor-based pagination nếu có maxId
      if (maxId) {
        params.max_id = maxId;
        console.log(`Using cursor-based pagination with max_id: ${maxId}`);
      } else {
        params.page = page;
        console.log(`Using page-based pagination with page: ${page}`);
      }
      
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params,
      };
      
      const response = await axios.get(`${API_BASE_URL}/feed`, config);
      
      console.log(`API Response:`, {
        postCount: response.data?.data?.length || response.data?.length,
        firstPostId: response.data?.data?.[0]?.id || response.data?.[0]?.id,
        lastPostId: response.data?.data?.slice(-1)[0]?.id || response.data?.slice(-1)[0]?.id,
      });
      
      return response;
    } catch (error) {
      console.error("Error fetching posts:", error);
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      console.log(`API Request: Toggling like for post ${postId}`);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // POST request to /api/posts/:id/like
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/like`,
        {}, // Empty body
        config
      );
      
      console.log(`API Response - Toggle like for post ${postId}:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error toggling like for post ${postId}:`, error);
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        `${API_BASE_URL}/posts`,
        postData,
        config
      );
      return response;
    } catch (error) {
      console.error("Error creating post:", error);
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.delete(
        `${API_BASE_URL}/posts/${postId}`,
        config
      );
      return response;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },
};

export default postsService;