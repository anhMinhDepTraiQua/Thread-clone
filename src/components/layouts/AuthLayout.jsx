import Login from "@/pages/Auth/Login";  
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import {Route, Routes } from "react-router";
export default function AuthLayout() {
  return (
    <div  className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden"
      style={{
        backgroundImage: `url("https://static.cdninstagram.com/rsrc.php/v4/ym/r/_qas8NM9G0b.png")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "contain",
      }}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
    </div>
  );
}