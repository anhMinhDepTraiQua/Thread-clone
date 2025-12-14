import React from "react";
import InteractionBar from "./InteractionBar";

export default function PostCard({ post, onLike }) {
  return (
    <article className="bg-white dark:bg-[#1c1e21] rounded-xl p-4 shadow-sm mb-4">
      <div className="flex gap-3">
        <img
          src={post.user.avatar || `https://i.pravatar.cc/40?u=${post.user.id}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.user.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">· {post.time || "2h"}</span>
              </div>
            </div>
            {/* menu dots */}
            <div className="text-gray-400">...</div>
          </div>

          <p className="mt-2 text-sm leading-relaxed">{post.content}</p>

          {post.media && post.media.length > 0 && (
            <div className="mt-3">
              <img src={post.media[0]} alt="media" className="w-full rounded-md max-h-80 object-cover" />
            </div>
          )}

          <InteractionBar stats={post.stats} onLike={() => onLike(post.id)} />
        </div>
      </div>
    </article>
  );
}
