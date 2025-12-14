import React from "react";
import { Home, Search, Plus, Heart, User } from "lucide-react";

const ThreadsIcon = () => <i className="fa-brands fa-threads"></i>;
// các icon chính
const items = [
  { key: "home", label: "", icon: Home },
  { key: "search", label: "", icon: Search },
  { key: "create", label: "", icon: Plus },
  { key: "activity", label: "", icon: Heart },
  { key: "profile", label: "", icon: User },
];
//logo
const logo = { key: "logo", label: "", icon: ThreadsIcon };
export default function Sidebar() {
  return (
    <nav className="sticky top-6">
      <div className="space-y-4">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.key === "home";
          return (
            <button
              key={it.key}
              className={`flex items-center px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                active ? "font-semibold bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <Icon className="" />
              <span className="hidden md:inline">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
