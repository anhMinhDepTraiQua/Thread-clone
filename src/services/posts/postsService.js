import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const postsService = {
  /**
   * Lấy danh sách posts với pagination
   * @param {number} page - Số trang cần lấy
   * @param {number} perPage - Số lượng posts mỗi trang
   * @param {string} type - Loại feed (for_you, following, etc.)
   * @returns {Promise} Response data
   */
  getPosts: async (page = 1, perPage = 10, type = "for_you") => {
    try {
      const token = localStorage.getItem("token");
      
      // Log để debug xem page nào đang được request
      console.log(`API Request: Fetching posts page ${page} with per_page ${perPage}`);
      
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { 
          type,
          page, 
          per_page: perPage,
          sort: 'created_at', // Sắp xếp theo thời gian tạo
          order: 'desc',      // Mới nhất trước
        },
      };
      
      // Đảm bảo URL đúng - dựa vào network tab của bạn
      const response = await axios.get(`${API_BASE_URL}/feed`, config);
      
      // Log response để kiểm tra
      console.log(`API Response page ${page}:`, {
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

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/like`,
        {},
        config
      );
      return response;
    } catch (error) {
      console.error("Error toggling like:", error);
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
};

export default postsService;