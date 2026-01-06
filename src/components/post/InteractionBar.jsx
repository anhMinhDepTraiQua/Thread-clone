import React, { useState } from "react";
import { Heart, MessageCircle, Repeat, Send } from "lucide-react";
import { toast } from "../Toast";

export default function InteractionBar({ 
  stats = {}, 
  isLiked = false,
  postId,
  onLike 
}) {
  // Local state cho optimistic update
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(stats.likes ?? 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLikeClick = async () => {
    // Lưu trạng thái cũ để rollback nếu API fail
    const previousIsLiked = localIsLiked;
    const previousLikes = localLikes;

    try {
      // 1. OPTIMISTIC UPDATE - Cập nhật UI ngay lập tức
      const newIsLiked = !localIsLiked;
      setLocalIsLiked(newIsLiked);
      setLocalLikes(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
      
      // Animation khi like
      if (newIsLiked) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }

      // 2. GỌI API - Chạy ngầm, user không cần chờ
      if (onLike) {
        await onLike(postId, newIsLiked);
      }

      // 3. Nếu thành công, không cần làm gì thêm (UI đã update rồi)
      
    } catch (error) {
      // 4. ROLLBACK - Nếu API fail, trả về trạng thái cũ
      console.error("Failed to like/unlike post:", error);
      setLocalIsLiked(previousIsLiked);
      setLocalLikes(previousLikes);
      
      // Hiển thị toast notification thay vì alert
      toast.error("Failed to update like. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-between mt-3 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-2 transition-colors ${
            localIsLiked 
              ? "text-pink-600 hover:text-pink-700" 
              : "hover:text-pink-600"
          }`}
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              localIsLiked ? "fill-current" : ""
            } ${
              isAnimating ? "scale-125" : "scale-100"
            }`}
          />
          <span className={localIsLiked ? "font-medium" : ""}>
            {localLikes}
          </span>
        </button>

        {/* Comment Button */}
        <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>{stats.comments ?? 0}</span>
        </button>

        {/* Repost Button */}
        <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
          <Repeat className="w-5 h-5" />
          <span>{stats.reposts ?? 0}</span>
        </button>

        {/* Share Button */}
        <button className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <Send className="w-5 h-5" />
          <span>{stats.shares ?? 0}</span>
        </button>
      </div>
    </div>
  );
}