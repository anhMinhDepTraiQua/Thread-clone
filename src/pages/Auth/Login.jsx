import { useState } from "react";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // authService.login trả về response.data (do interceptor)
      const responseData = await authService.login({
        login: loginValue,      
        password: password,
      });

      console.log("🔍 Response data:", responseData);

      // API trả về: { success, message, data: { user, access_token, refresh_token, expires_in } }
      const { access_token, refresh_token, user } = responseData.data;

      console.log("📦 Extracted:", { access_token, refresh_token, user });

      if (!access_token) {
        throw new Error("No access token received from server");
      }

      // Lưu vào localStorage với key đúng
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Login successful!");
      console.log("Saved accessToken:", localStorage.getItem("accessToken"));

      navigate("/"); 
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute inset-0"></div>

      {/* Login box */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <h2 className="text-center text-sm font-bold text-black mb-6">
          Log in with your Instagram account
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="email"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
            autoComplete="current-password"
          />

          {/* Hiển thị lỗi */}
          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-black text-white font-medium text-sm hover:bg-black/90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center flex gap-10 justify-center">
          <a href="/thread-clone/forgot-password" className="text-sm text-gray-500 hover:underline">
            Forgot password?
          </a>
          <a href="/thread-clone/Register" className="text-sm text-gray-500 hover:underline">
            Register
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-xs text-gray-400">
        © 2025 Threads · Terms · Privacy Policy · Cookies Policy · Report a problem
      </div>
    </div>
  );
}