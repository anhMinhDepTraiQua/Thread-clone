import React from "react";
import InteractionBar from "./InteractionBar";

export default function PostCard({ post, onLike }) {
  
  // Render media grid với layout thông minh
  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const imageCount = post.images.length;

    // 1 ảnh: full width
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

    // 2 ảnh: 2 cột
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

    // 3 ảnh: 1 ảnh lớn bên trái, 2 ảnh nhỏ bên phải
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

    // 4+ ảnh: grid 2x2, ảnh thứ 4 có overlay nếu có nhiều hơn 4 ảnh
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

  // Render audio files
  const renderAudio = () => {
    if (!post.audio || post.audio.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {post.audio.map((audioUrl, idx) => (
          <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <svg 
                className="w-5 h-5 text-blue-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Audio {post.audio.length > 1 ? `${idx + 1}` : ''}
              </span>
            </div>
            <audio 
              controls 
              className="w-full h-10"
              preload="metadata"
            >
              <source src={audioUrl} />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    );
  };

  // Fallback cho old media format
  const renderLegacyMedia = () => {
    if (!post.media || post.media.length === 0) return null;
    if ((post.images && post.images.length > 0) || (post.audio && post.audio.length > 0)) {
      return null;
    }

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
    // Gọi callback từ parent component (Home)
    if (onLike) {
      await onLike(postId, newIsLiked);
    }
  };
  return (
    <article className="bg-white dark:bg-[#1c1e21] px-[24px] py-[16px] shadow-sm border-b border-l border-r border-gray-200 dark:border-gray-700 overflow-hidden">
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
        <div className="flex-1 min-w-0"> {/* Thêm min-w-0 cực kỳ quan trọng cho flex-item */}
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
            {/* menu dots */}
            <button className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition ml-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          {/* Sửa chính ở đây: Thêm break-words và min-w-0 */}
          <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Render media */}
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