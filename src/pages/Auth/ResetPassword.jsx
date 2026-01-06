import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "@/utils/httpRequest"; 

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [validToken, setValidToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate token
  useEffect(() => {
    if (!token) {
      setValidToken(false);
      return;
    }

    axios
      .get("/api/auth/validate-reset-token", {
        params: { token },
      })
      .then(() => setValidToken(true))
      .catch(() => setValidToken(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      navigate("/login", {
        state: {
          message: "Tạo mật khẩu mới thành công, vui lòng đăng nhập",
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Reset mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) return <p>Checking token...</p>;

  if (!validToken)
    return <p className="text-red-500">Liên kết đã hết hạn hoặc không hợp lệ</p>;

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-center font-bold mb-6">Create new password</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-gray-100"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-gray-100"
        />

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          disabled={loading}
          className="w-full h-12 rounded-xl bg-black text-white"
        >
          {loading ? "Saving..." : "Create new password"}
        </button>
      </form>
    </div>
  );
}
