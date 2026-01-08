import { Routes, Route, useLocation } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout/index";
import FeedHeader from "@/components/FeedHeader";
import AuthLayout from "@/layouts/AuthLayout";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import ModalLayout from "@/components/post/Modal";
import CreatePost from "@/components/post/CreatePost";
import EditProfileModal from "./components/EditProfile";
import ReplyModal from "./components/post/ReplyModal";
import PostDetail from "./pages/Post/PostDetail";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { navigationService } from './utils/navigation';
export default function AppContent() {
   const navigate = useNavigate();
  
  useEffect(() => {
    // Thiết lập navigator cho service
    navigationService.setNavigator(navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Nhóm các trang sử dụng DefaultLayout */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="" element={<FeedHeader />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:postId" element={<PostDetail />} />
      </Route>

      {/* Nhóm các trang sử dụng AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>
      {/* Nhóm các trang sử dụng ModalLayout */}
      <Route element={<ModalLayout />}>
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/EditProfile" element={<EditProfileModal />} />
        <Route path="/ReplyModal" element={<ReplyModal />} />
      </Route>
    </Routes>
  );
}
