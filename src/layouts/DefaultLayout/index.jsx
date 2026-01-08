import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  function isAuthenticated() {
    const user = localStorage.getItem("user");
    // Giữ nguyên logic của bạn: Trả về true nếu chưa có user để hiện RightPanel
    return !user; 
  }

  return (
    <div className="bg-[rgb(250,250,250)] dark:bg-[rgb(16,16,16)] text-gray-900 dark:text-gray-100 min-h-screen">
      
      {/* Sidebar - Cố định bên trái */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[72px] justify-center z-50">
        <Sidebar />
      </aside>

      {/* Container chính: Sử dụng Flex để điều phối không gian */}
      <div className="md:pl-[72px] flex justify-center w-full">
        <div className="w-full max-w-[1230px] flex justify-center px-4 md:px-6">
          
          {/* 1. Khoảng trống giả lập bên trái để đẩy Feed vào giữa nếu cần đối trọng với Right Panel */}
          <div className="hidden lg:block lg:w-[350px]"></div>

          {/* 2. Main Feed - Luôn chiếm vị trí trung tâm */}
          <main className="w-full max-w-[640px] flex-shrink-0 ">
            <Outlet />
          </main>

          {/* 3. Right Panel - Cố định độ rộng bên phải */}
          <aside className="hidden lg:block lg:w-[350px] ml-10">
            {isAuthenticated() && <RightPanel />}
          </aside>

        </div>
      </div>
    </div>
  );
}