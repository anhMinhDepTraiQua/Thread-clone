// src/services/posts/index.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com",
  // thêm config nếu cần (auth headers...)
});

export default {
  getPosts() {
    // ví dụ dùng placeholder — thay bằng endpoint của bạn
    // jsonplaceholder /posts không có user avatar; giả lập data transform bên dưới
    return api.get("/posts?_limit=10");
  },
  // get single, create post...
};
