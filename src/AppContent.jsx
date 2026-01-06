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
import ResetPassword from "@/pages/Auth/ResetPassword";
import ModalLayout from "@/components/post/Modal";
import CreatePost from "@/components/post/CreatePost";
import EditProfileModal from "./components/EditProfile";
export default function AppContent() {
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

    {/* Nhóm các trang sử dụng AuthLayout */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Route>
    {/* Nhóm các trang sử dụng ModalLayout */}
    <Route element={<ModalLayout />}>
      <Route path="/CreatePost" element={<CreatePost />} />
      <Route path="/EditProfile" element={<EditProfileModal />} />
    </Route>
  </Routes>
);
}
