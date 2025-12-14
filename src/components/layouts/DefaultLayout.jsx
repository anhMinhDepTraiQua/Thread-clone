import React from "react";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";

export default function DefaultLayout({ children }) {
  return (
    <div className="bg-[rgb(250,250,250)] dark:bg-[rgb(16,16,16)] text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 py-6">
          {/* Sidebar */}
          <aside className="col-span-2 hidden md:block">
            <Sidebar />
          </aside>

          {/* Main content */}
          <main className="col-span-12 md:col-span-7 lg:col-span-6">
            {children}
          </main>

          {/* Right panel */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-4 hidden md:block">
            <RightPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
