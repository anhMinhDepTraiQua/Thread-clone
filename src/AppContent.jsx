import { Routes, Route, useLocation } from "react-router-dom";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import FeedHeader from "@/components/FeedHeader";
import AuthLayout from "@/components/layouts/AuthLayout";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
export default function AppContent() {
  const { pathname } = useLocation();

  const titleMap = {
    "/": "Home",
    "/search": "Search",
    "/notifications": "Notifications",
    "/profile": "Profile",
  };

  const title = titleMap[pathname] || "Home";

return (
  <Routes>
    {/* Nhóm các trang sử dụng DefaultLayout */}
    <Route element={<DefaultLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="" element={<FeedHeader/>}/>
      <Route path="/search" element={<Search />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    {/* Nhóm các trang sử dụng AuthLayout (ví dụ: Login) */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>
  </Routes>
);
}
