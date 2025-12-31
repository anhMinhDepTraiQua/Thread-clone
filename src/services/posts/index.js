import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://threads.f8team.dev",
  // Nếu có token thì gắn ở đây
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export default {
  /**
   * Lấy danh sách bài post (feed)
   * @param {Object} params
   * @param {"for_you" | "following" | "ghost"} params.type
   * @param {number} [params.page]
   * @param {number} [params.per_page]
   */
  getPosts({ type = "for_you", page = 1, per_page = 10 } = {}) {
    return api.get("/api/posts/feed", {
      params: {
        type,
        page,
        per_page,
      },
    });
  },
};
