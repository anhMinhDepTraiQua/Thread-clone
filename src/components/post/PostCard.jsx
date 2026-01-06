import { useState, useRef, useEffect } from "react"; // Thêm useRef và useEffect để đóng menu khi click ngoài
import React from "react";
import InteractionBar from "./InteractionBar";

export default function PostCard({ post, onLike }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi click ra ngoài vùng menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;
    const imageCount = post.images.length;

    if (imageCount === 1) {
      return (
        <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          <img 
            src={post.images[0]} 
            alt="Post media" 
            className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition"
            onClick={() => window.open(post.images[0], '_blank')}
          />
        </div>
      );
    }

    if (imageCount === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
          {post.images.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={`Media ${idx + 1}`}
              className="w-full h-64 object-cover cursor-pointer hover:opacity-95 transition"
              onClick={() => window.open(img, '_blank')}
            />
          ))}
        </div>
      );
    }

    if (imageCount === 3) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <img 
            src={post.images[0]} 
            alt="Media 1"
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition"
            onClick={() => window.open(post.images[0], '_blank')}
          />
          <div className="grid grid-rows-2 gap-2">
            {post.images.slice(1, 3).map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`Media ${idx + 2}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition"
                onClick={() => window.open(img, '_blank')}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
        {post.images.slice(0, 4).map((img, idx) => (
          <div key={idx} className="relative">
            <img 
              src={img} 
              alt={`Media ${idx + 1}`}
              className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition"
              onClick={() => window.open(img, '_blank')}
            />
            {idx === 3 && imageCount > 4 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer"
                onClick={() => window.open(img, '_blank')}
              >
                <span className="text-white text-2xl font-bold">+{imageCount - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAudio = () => {
    if (!post.audio || post.audio.length === 0) return null;
    return (
      <div className="mt-3 space-y-2">
        {post.audio.map((audioUrl, idx) => (
          <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Audio {post.audio.length > 1 ? `${idx + 1}` : ''}
              </span>
            </div>
            <audio controls className="w-full h-10" preload="metadata">
              <source src={audioUrl} />
            </audio>
          </div>
        ))}
      </div>
    );
  };

  const renderLegacyMedia = () => {
    if (!post.media || post.media.length === 0) return null;
    if ((post.images && post.images.length > 0) || (post.audio && post.audio.length > 0)) return null;
    return (
      <div className="mt-3">
        <img 
          src={post.media[0]} 
          alt="media" 
          className="w-full rounded-md max-h-80 object-cover cursor-pointer hover:opacity-95 transition"
          onClick={() => window.open(post.media[0], '_blank')}
        />
      </div>
    );
  };

  const handleLike = async (postId, newIsLiked) => {
    if (onLike) await onLike(postId, newIsLiked);
  };

  const menuItems = [
    { label: "Lưu bài viết"},
    { label: "Giao diện", hasSub: true},
    { label: "Xóa bài viết", color: "text-red-500"},
  ];

  return (
    <article className="bg-white dark:bg-[#1c1e21] px-[24px] py-[16px] shadow-sm border-b border-l border-r border-gray-200 dark:border-gray-700 overflow-visible relative">
      <div className="flex gap-3">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <img
            src={post.user.avatar || `https://i.pravatar.cc/40?u=${post.user.id}`}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white truncate">
                  {post.user.name}
                </span>
                <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  · {post.time || "2h"}
                </span>
              </div>
            </div>

            {/* --- MENU DOTS CONTAINER --- */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-800 "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {/* Dropdown Box */}
                      {isMenuOpen && (
                      <>
                        <style>{`
                        @keyframes menuEnter {
                          from { opacity: 0; transform: translateY(-6px) scale(.95); }
                          to   { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        `}</style>

                        <div
                        className="absolute right-0 mt-2 w-30 bg-white dark:bg-[#242526] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden"
                        style={{ animation: 'menuEnter 150ms ease-out forwards' }}
                        >
                        <div className="py-1">
                          {menuItems.map((item, index) => (
                          <button 
                            key={index}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
                            onClick={() => {
                            setIsMenuOpen(false);
                            if (item.fn) item.fn();
                            }}
                          >
                            <span className={item.color || ""}>{item.label}</span>
                            {item.icon && <i className={`fa-solid ${item.icon} text-xs opacity-60`}></i>}
                          </button>
                          ))}
                        </div>
                        </div>
                      </>
                      )}
                    </div>
                    {/* --- END MENU DOTS --- */}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {renderImages()}
          {renderAudio()}
          {renderLegacyMedia()}

          <InteractionBar 
            stats={post.stats}
            isLiked={post.isLiked}
            postId={post.id}
            onLike={handleLike}
          />
        </div>
      </div>
    </article>
  );
}