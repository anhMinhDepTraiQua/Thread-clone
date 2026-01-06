import { useState, useEffect } from "react";
import FeedHeader from "@/components/FeedHeader";
import Modal from "@/components/post/Modal"; // Import Modal component
import EditProfileModal from "@/components/EditProfile"; // Import EditProfileModal
import CreatePost from "@/components/post/CreatePost";
import { Instagram, BarChart2, PlusCircle } from "lucide-react";
import axiosClient from "@/utils/httpRequest";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await axiosClient.get("/api/auth/user");
      setUser(
        userData.data?.user || userData.user || userData.data || userData
      );
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <FeedHeader title="Profile" />
        <div className="p-4 bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-gray-700 rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]">
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  const username = user?.username || "User";
  const displayName = user?.name || username;
  const bio = user?.bio || "welcome to my profile";
  const email = user?.email || "";
  const hasAvatar = user?.avatar_url || user?.avatar;

  return (
    <div className="flex flex-col">
      <FeedHeader title="Profile" />
      <div className="p-4 bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-gray-700 rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]">
        {/* 1. Header Info Section */}
        <div className="flex justify-between items-start mt-4">
          <div className="flex-1">
            <h1 className="text-[28px] font-bold">{displayName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[15px]">{username}</span>
              <span className="bg-[#181818] text-[#4D4D4D] text-[12px] px-2 py-0.5 rounded-full">
                threads.net
              </span>
            </div>
          </div>
          <div className="w-[84px] h-[84px] rounded-full overflow-hidden border border-[#2A2A2A]">
            {hasAvatar ? (
              <img
                src={user.avatar_url || user.avatar}
                alt={`${username}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-[15px] leading-relaxed">{bio}</div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mt-4 text-[#4D4D4D]">
          {["Gamer", "CS2"].map((tag) => (
            <span
              key={tag}
              className="bg-[#181818] px-3 py-1 rounded-full text-[13px] border border-[#2A2A2A] hover:text-white cursor-pointer"
            >
              {tag}
            </span>
          ))}
          <span className="bg-[#002d40] text-[#0095f6] px-3 py-1 rounded-full text-[13px] border border-[#004a6d] flex items-center gap-1 cursor-pointer">
            <PlusCircle size={14} className="fill-current" /> League of Legends
          </span>
          <span className="bg-[#181818] px-3 py-1 rounded-full text-[13px] border border-[#2A2A2A] hover:text-white cursor-pointer">
            VALORANT
          </span>
          <span className="bg-[#181818] w-8 h-8 flex items-center justify-center rounded-full border border-[#2A2A2A] cursor-pointer">
            +
          </span>
        </div>

        {/* Followers & Social Icons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2 text-[#4D4D4D] text-[14px]">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-black bg-gray-600 overflow-hidden"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                    alt="follower"
                  />
                </div>
              ))}
            </div>
            <span className="hover:underline cursor-pointer">
              12 người theo dõi
            </span>
            {email && (
              <>
                <span>•</span>
                <span className="hover:underline cursor-pointer">{email}</span>
              </>
            )}
          </div>
          <div className="flex gap-4 text-white">
            <div className="p-1 hover:bg-[#181818] rounded-md cursor-pointer">
              <BarChart2 size={24} />
            </div>
            <div className="p-1 hover:bg-[#181818] rounded-md cursor-pointer">
              <Instagram size={24} />
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full border border-[#2A2A2A] rounded-xl py-2 font-bold mt-6 hover:bg-[#101010] transition-colors"
        >
          Chỉnh sửa trang cá nhân
        </button>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          size="lg"
        >
          <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
        </Modal>

        {/* 2. Tabs Navigation */}
        <div className="flex mt-6 border-b border-[#2A2A2A]">
          {["Thread", "Thread trả lời", "File phương tiện", "Bài đăng lại"].map(
            (tab, idx) => (
              <div
                key={tab}
                className={`flex-1 text-center pb-3 text-[15px] font-semibold cursor-pointer transition-colors ${
                  idx === 0
                    ? "text-white border-b-2 border-white"
                    : "text-[#4D4D4D] hover:text-gray-300"
                }`}
              >
                {tab}
              </div>
            )
          )}
        </div>

        {/* 3. Quick Post Input */}
        <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            {hasAvatar ? (
              <img
                src={user.avatar_url || user.avatar}
                className="w-9 h-9 rounded-full opacity-80"
                alt={`${username}'s avatar`}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm opacity-80">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <button onClick={() => setIsCreatePostOpen(true)}>
              <span className="text-[#4D4D4D] text-[15px] cursor-text">Có gì mới?</span>
            </button>
          </div>
          <button
            className="bg-[#181818] text-[#FFF] border border-[#2A2A2A] px-4 py-1.5 rounded-lg font-bold text-[14px] cursor-pointer transition"
            onClick={() => setIsCreatePostOpen(true)}
          >
            Đăng
          </button>
          <Modal
            isOpen={isCreatePostOpen}
            onClose={() => setIsCreatePostOpen(false)}
            size="lg"
          >
            <CreatePost
              user={user}
              onClose={() => setIsCreatePostOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Profile;
