import { useState } from "react";
import axios from "@/utils/httpRequest";
import { NavLink } from "react-router-dom";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email là bắt buộc");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/forgot-password", { email });

      setMessage("Liên kết đặt lại mật khẩu đã được gửi tới email của bạn.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute inset-0"></div>

      <div className="relative z-10 w-full max-w-sm px-4">
        <h2 className="text-center text-sm font-bold text-black mb-6">
          Type your email to reset your password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-600 text-xs">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-black text-white font-medium text-sm hover:bg-black/90 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <NavLink
            to="/login"
            className="text-sm text-gray-500 hover:underline"
          >
            Already have an account? Log in
          </NavLink>
        </div>
      </div>

      <div className="absolute bottom-4 w-full text-center text-xs text-gray-400">
        © 2025 Threads · Terms · Privacy Policy · Cookies Policy · Report a
        problem
      </div>
    </div>
  );
}
