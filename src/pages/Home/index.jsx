import React, { useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import WhatAreYouThinking from "@/components/post/WhatAreYouThinking";
import FeedHeader from "@/components/FeedHeader";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, toggleLike } from "@/components/post/postsSlice";

function transformPosts(apiPosts = []) {
  return apiPosts.map((p) => ({
    id: p.id,
    user: {
      id: p.user.id,
      name: p.user.name,
      avatar: p.user.avatar || null,
    },
    time: new Date(p.created_at).toLocaleString(),
    content: p.content,
    media: p.media_urls || [],
    stats: {
      likes: p.likes_count,
      comments: p.replies_count,
      reposts: p.reposts_and_quotes_count,
    },
  }));
}

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.posts);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  // ⚠️ QUAN TRỌNG: items.data mới là array
  const posts = transformPosts(items?.data || []);

  const handleLike = (id) => {
    dispatch(toggleLike(id));
  };
  //khi chưa đăng nhập sẽ ẩn "WhatAreYouThinking" đi
  function isAuthenticated() {
    const user = localStorage.getItem("user");
    return !!user; // Trả về true nếu có user, false nếu không có
  }
  return (
    <div>
      <FeedHeader title="Home" />
      {isAuthenticated() && <WhatAreYouThinking />}
      <div>
        {status === "loading" && (
          <div className="text-center py-10">Loading...</div>
        )}

        {status === "failed" && (
          <div className="text-center py-10 text-red-500">
            Error loading posts
          </div>
        )}

        {posts.map((p) => (
          <PostCard key={p.id} post={p} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
}

