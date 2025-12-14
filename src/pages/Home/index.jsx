import React, { useEffect } from "react";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import FeedHeader from "@/components/FeedHeader";
import PostCard from "@/components/post/PostCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, toggleLike } from "@/components/post/postsSlice";

function transformPosts(apiPosts) {
  // nếu dùng jsonplaceholder chuyển thành cấu trúc nhỏ
  return apiPosts.map((p) => ({
    id: p.id,
    user: { id: p.userId || p.id, name: `User ${p.userId || p.id}`, avatar: null },
    time: "2h",
    content: p.body || p.content || "",
    media: [],
    stats: { likes: Math.floor(Math.random() * 1000), comments: Math.floor(Math.random() * 200), reposts: Math.floor(Math.random() * 50) },
  }));
}

export default function Home() {
  const dispatch = useDispatch();
  const postsState = useSelector((s) => s.posts);
  const { items, status } = postsState;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  // nếu API khác: map data
  const posts = items && items.length > 0 && items[0] && items[0].body ? transformPosts(items) : items;

  const handleLike = (id) => {
    dispatch(toggleLike(id));
    // optional: call API to persist like
  };

  return (
    <DefaultLayout>
      <FeedHeader title="Home" />
      <div className="mt-4">
        {status === "loading" && <div className="text-center py-10">Loading...</div>}
        {status === "failed" && <div className="text-center py-10 text-red-500">Error loading posts</div>}

        {posts && posts.map((p) => <PostCard key={p.id} post={p} onLike={handleLike} />)}
      </div>
    </DefaultLayout>
  );
}
