import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "@/utils/httpRequest";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra token có tồn tại không
  if (!token) {
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
              Liên kết không hợp lệ
            </h2>
            <p className="text-red-500 text-sm mb-6">
              Không tìm thấy token xác thực
            </p>
          </div>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full h-12 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition"
          >
            Yêu cầu liên kết mới
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!password || !confirm) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      // Gửi request reset password
      await axios.post("/api/auth/reset-password", {
        token,
        email: "", // Backend sẽ lấy email từ token
        password,
        password_confirmation: confirm,
      });

      // Chuyển về trang login với thông báo thành công
      navigate("/login", {
        state: {
          message: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập.",
        },
      });
    } catch (err) {
      // Xử lý các loại error khác nhau
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError("Token đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu liên kết mới.");
      } else {
        setError(
          err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Form reset password - hiển thị luôn không cần validate trước
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <h2 className="text-center text-2xl font-bold text-black mb-6">
          Tạo mật khẩu mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-red-500 text-xs">{error}</p>
              {(error.includes("hết hạn") || error.includes("không hợp lệ")) && (
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="mt-2 text-xs text-blue-600 hover:underline"
                >
                  Yêu cầu liên kết mới →
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-black text-white font-medium text-sm hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Tạo mật khẩu mới"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:underline cursor-pointer"
          >
            Quay lại đăng nhập
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