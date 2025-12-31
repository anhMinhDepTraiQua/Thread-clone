import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import FeedHeader from "@/components/FeedHeader";
import { Outlet } from "react-router-dom";
export default function DefaultLayout({ children }) {
  return (
    <div className="bg-[rgb(250,250,250)] dark:bg-[rgb(16,16,16)] text-gray-900 dark:text-gray-100 min-h-screen">
      
      {/* Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[72px] justify-center overflow-visible z-50">
        <Sidebar />
      </aside>

      {/* Main container */}
      <div className="md:pl-[72px]">
        <div className="max-w-[960px] mx-auto grid grid-cols-12 gap-6">
          {/* Main feed */}
          <main className="col-span-8 lg:col-span-8">
            <Outlet />
          </main>

          {/* Right panel */}
          <aside className="hidden lg:block lg:col-span-4 ">
            <RightPanel />
          </aside>

        </div>
      </div>
    </div>
  );
}
