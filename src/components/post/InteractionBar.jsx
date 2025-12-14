import React from "react";
import { Heart, MessageCircle, Repeat, Send } from "lucide-react";

export default function InteractionBar({ stats = {}, onLike }) {
  return (
    <div className="flex items-center justify-between mt-3 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <button onClick={onLike} className="flex items-center gap-2 hover:text-pink-600">
          <Heart className="w-5 h-5" />
          <span>{stats.likes ?? 0}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-blue-600">
          <MessageCircle className="w-5 h-5" />
          <span>{stats.comments ?? 0}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-green-600">
          <Repeat className="w-5 h-5" />
          <span>{stats.reposts ?? 0}</span>
        </button>
      </div>

      <button className="flex items-center gap-2 hover:text-gray-700">
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
