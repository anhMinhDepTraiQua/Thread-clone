import { NavLink } from "react-router-dom";
import Modal from "@/components/post/Modal";
import CreatePost from "@/components/post/CreatePost";
import { useState, useRef, useEffect } from "react";
import { authService } from "@/services/auth"; 

export default function Sidebar() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const logout = async () => {
    try {
      // Gọi API logout
      await authService.LogOut();
      
      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setIsMenuOpen(false);
      
      // Redirect to login
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      
      // Fallback: Force logout locally even if API fails
      // Vì có thể token đã hết hạn (401) nhưng vẫn cần logout phía client
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };
  
  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    isActive ? "text-white font-semibold" : "text-gray-600";

  // Select Box Menu Items
  const menuItems = [
    { label: "Giao diện", icon: "fa-chevron-right", hasSub: true },
    { label: "Thông tin chi tiết", icon: null },
    { label: "Cài đặt", icon: null },
    { label: "Bảng feed", icon: "fa-chevron-right", hasSub: true, borderTop: true },
    { label: "Đã lưu", icon: null },
    { label: "Đã thích", icon: null },
    { label: "Báo cáo sự cố", icon: null, borderTop: true },
    { label: "Đăng xuất", icon: null, color: "text-red-600", fn: logout },
  ];

  return (
    <div className="w-[76px] h-screen flex flex-col justify-between items-center sticky top-0 z-[100] isolate">
      {/* Phía trên của sidebar */}
      <div className="hover:scale-105 transition-all duration-200">
        <NavLink to="/">
          <i className="fa-brands fa-threads text-4xl py-[15px]"></i>
        </NavLink>
      </div>

      <div className="flex flex-col gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClass({ isActive })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-solid fa-house text-2xl"></i>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `${linkClass({ isActive })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-solid fa-magnifying-glass text-2xl"></i>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsCreatePostOpen(true)}
          className="outline-none select-none w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform text-gray-600 bg-gray-200 dark:bg-gray-700 cursor-pointer hover:text-white"
        >
          <i className="fa-solid fa-plus text-2xl"></i>
        </button>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${linkClass({ isActive })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-regular fa-heart text-2xl"></i>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkClass({ isActive })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-solid fa-user text-2xl"></i>
        </NavLink>
      </div>

      {/* Phía dưới của sidebar - Phần Hamburger Select Box */}
      <div className="relative flex flex-col gap-4 mb-[22px]" ref={menuRef}>
        
        {/* Select Box / Popover */}
        <div 
          className={`absolute bottom-full left-4 mb-3 w-[240px] bg-[#181818] border border-[#2d2d2d] rounded-2xl shadow-2xl overflow-hidden py-2 transition-all duration-300 origin-bottom-left ${
            isMenuOpen 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-90 translate-y-4 pointer-events-none"
          }`}
        >
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.borderTop && <div className="h-[1px] bg-[#2d2d2d] my-1 mx-4" />}
              <button 
                className="w-full flex items-center justify-between px-4 py-3 text-[15px] cursor-pointer font-medium text-[#f3f5f7] transition-colors hover:rounded hover:bg-[#242424] ml-[10px]"
                onClick={() => {
                  if (item.fn) {
                    item.fn();
                  }
                }}
              >
                <span className={item.color}>{item.label}</span>
                {item.hasSub && <i className={`fa-solid ${item.icon} text-[10px] text-gray-500`}></i>}
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center justify-center transition-all duration-200 transform cursor-pointer hover:text-white ${isMenuOpen ? "text-white" : "text-gray-600"}`}
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
      </div>

      <Modal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} size="lg">
        <CreatePost />
      </Modal>
    </div>
  );
}