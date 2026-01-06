// config/api.js
// Cấu hình API base URL cho toàn bộ ứng dụng

// === QUAN TRỌNG: Chọn đúng base URL của backend ===

// OPTION 1: Backend Laravel chạy riêng port 8000
export const API_BASE_URL = "http://localhost:8000/api";

// OPTION 2: Backend cùng port với frontend (proxy)
// export const API_BASE_URL = "/api";

// OPTION 3: Backend có base path
// export const API_BASE_URL = "/thread-clone/api";

// Production URL
// export const API_BASE_URL = "https://yourdomain.com/api";

console.log("🔗 API Base URL:", API_BASE_URL);

export default API_BASE_URL;