import { NavLink } from "react-router-dom";
import Modal from "@/components/post/Modal";
import CreatePost from "@/components/post/CreatePost";
import { useState } from "react";
export default function Sidebar() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white font-semibold pb-1"
      : "text-gray-600 hover:text-white";
  return (
    <div className="w-[76px] h-screen flex flex-col justify-between items-center sticky top-0 z-[100] isolate">
      {/* phía trên của sidebar */}
      <div className="hover:scale-105 transition-all duration-200">
        <a href="">
          <i className="fa-brands fa-threads text-4xl py-[15px]"></i>
        </a>
      </div>
      <div className="flex flex-col gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClass({
              isActive,
            })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-solid fa-house text-2xl"></i>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `${linkClass({
              isActive,
            })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-solid fa-magnifying-glass text-2xl"></i>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsCreatePostOpen(true)}
          className={
            " outline-none select-none w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform text-gray-600 bg-gray-200 dark:bg-gray-700 cursor-pointer hover:text-white"
          }
        >
          <i className="fa-solid fa-plus text-2xl "></i>
        </button>
        <Modal
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          size="lg"
        >
          <CreatePost />
        </Modal>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${linkClass({
              isActive,
            })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-regular fa-heart text-2xl"></i>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkClass({
              isActive,
            })} w-15 h-10 flex items-center justify-center rounded-[10px] transition-all duration-200 transform hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700`
          }
        >
          <i className="fa-solid fa-user text-2xl"></i>
        </NavLink>
      </div>

      {/* phía dưới của sidebar */}
      <div className="flex flex-col gap-4 mb-[22px]">
        <button
          className={
            "flex items-center justify-center transition-all duration-200 transform text-gray-600 cursor-pointer hover:text-white"
          }
        >
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
      </div>
    </div>
  );
}
