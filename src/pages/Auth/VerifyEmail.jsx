import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { httpRequest } from "@/utils/httpRequest";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Không tìm thấy token xác thực");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        setLoading(true);
        
        console.log("=== Verify Email ===");
        console.log("Token:", token);
        console.log("Sending POST request to /api/auth/verify-email");
        
        // Thử cách 1: Token trong body
        const response = await httpRequest.post(
          "/api/auth/verify-email", 
          { token },
          { timeout: 30000 }
        );
        
        console.log("✅ Success response:", response);
        
        setSuccess(true);
        setError("");
      } catch (err) {
        console.error("❌ Verify email error:", err);
        console.error("Error response:", err.response);
        console.error("Error code:", err.code);
        console.error("Error config:", err.config);
        
        // Nếu timeout, thử cách 2: Token trong query params
        if (err.code === 'ECONNABORTED' || !err.response) {
          console.log("Trying alternative method: token as query param");
          
          try {
            const response2 = await httpRequest.post(
              `/api/auth/verify-email?token=${token}`,
              {},
              { timeout: 30000 }
            );
            
            console.log("✅ Success with query param:", response2);
            setSuccess(true);
            setError("");
            setLoading(false);
            return;
          } catch (err2) {
            console.error("❌ Alternative method also failed:", err2);
          }
        }
        
        // Xử lý error
        if (err.code === 'ECONNABORTED') {
          setError("Yêu cầu xác minh quá lâu. Vui lòng thử lại sau.");
        } else if (err.response?.status === 400) {
          setError("Token không hợp lệ hoặc đã được sử dụng");
        } else if (err.response?.status === 404) {
          setError("Không tìm thấy endpoint xác minh. Vui lòng liên hệ quản trị viên.");
        } else if (err.response?.status === 401) {
          setError("Token đã hết hạn. Vui lòng đăng ký lại.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        }
        
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang xác minh...</p>
          <p className="text-gray-400 text-xs mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm px-4 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold text-black mb-2">
              Xác minh thất bại
            </h2>
            <p className="text-red-500 text-sm mb-6">{error}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full h-12 rounded-xl bg-gray-200 text-black font-medium hover:bg-gray-300 transition"
            >
              Thử lại
            </button>
            
            <button
              onClick={() => navigate("/register")}
              className="w-full h-12 rounded-xl bg-gray-200 text-black font-medium hover:bg-gray-300 transition"
            >
              Đăng ký lại
            </button>
            
            <button
              onClick={() => navigate("/login")}
              className="w-full h-12 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition"
            >
              Đi tới trang đăng nhập
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 w-full text-center text-xs text-gray-400">
          © 2025 Threads · Terms · Privacy Policy · Cookies Policy · Report a
          problem
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-4 text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-black mb-2">
            Xác minh thành công!
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Đã xác minh tài khoản thành công. Vui lòng đăng nhập.
          </p>
        </div>
        <button
          onClick={() => navigate("/login", { state: { verified: true } })}
          className="w-full h-12 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition"
        >
          Đi tới trang đăng nhập
        </button>
      </div>

      <div className="absolute bottom-4 w-full text-center text-xs text-gray-400">
        © 2025 Threads · Terms · Privacy Policy · Cookies Policy · Report a
        problem
      </div>
    </div>
  );
}