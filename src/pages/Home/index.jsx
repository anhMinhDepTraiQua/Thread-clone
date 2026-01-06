import React, { useEffect, useCallback } from "react";
import PostCard from "@/components/post/PostCard";
import WhatAreYouThinking from "@/components/post/WhatAreYouThinking";
import FeedHeader from "@/components/FeedHeader";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, toggleLike } from "@/components/post/postsSlice";
import useInfiniteScroll from "@/services/hooks/useInfiniteScroll";

function transformPosts(apiPosts = []) {
  return apiPosts.map((p) => {
    // Xử lý media urls - có thể là array hoặc string JSON
    let mediaUrls = [];
    if (p.media_urls) {
      if (Array.isArray(p.media_urls)) {
        mediaUrls = p.media_urls;
      } else if (typeof p.media_urls === "string") {
        try {
          mediaUrls = JSON.parse(p.media_urls);
        } catch (e) {
          mediaUrls = [p.media_urls];
        }
      }
    }

    // Phân loại media thành images và audio
    const images = [];
    const audio = [];

    mediaUrls.forEach((url) => {
      if (typeof url === "string") {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)) {
          images.push(url);
        } else if (lowerUrl.match(/\.(mp3|wav|ogg|m4a|aac)$/)) {
          audio.push(url);
        } else {
          images.push(url);
        }
      } else if (typeof url === "object") {
        if (url.type === "audio" || url.type?.startsWith("audio/")) {
          audio.push(url.url || url);
        } else {
          images.push(url.url || url);
        }
      }
    });

    return {
      id: p.id,
      user: {
        id: p.user.id,
        name: p.user.name,
        avatar: p.user.avatar || null,
      },
      time: new Date(p.created_at).toLocaleString(),
      content: p.content,
      media: mediaUrls,
      images: images,
      audio: audio,
      stats: {
        likes: p.likes_count,
        comments: p.replies_count,
        reposts: p.reposts_and_quotes_count,
      },
      isLiked: p.is_liked || false,
      isReposted: p.is_reposted || false,
    };
  });
}

function isAuthenticated() {
  const user = localStorage.getItem("user");
  return !!user;
}

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, currentPage, hasMore } = useSelector((s) => s.posts);

  // Debug: Log Redux state
  useEffect(() => {
    console.log("Redux State:", { currentPage, hasMore, status, postsCount: items?.data?.length });
  }, [currentPage, hasMore, status, items]);

  // Load initial posts
  useEffect(() => {
    if (status === "idle") {
      console.log("Initial load: Fetching page 1");
      dispatch(fetchPosts({ page: 1, maxId: null }));
    }
  }, [dispatch, status]);

  // Callback để load thêm posts khi scroll đến cuối
  const loadMorePosts = useCallback(() => {
    if (status !== "loading" && hasMore) {
      const nextPage = currentPage + 1;
      
      // Lấy ID của post cuối cùng để dùng làm cursor
      const lastPostId = items?.data?.[items.data.length - 1]?.id;
      
      console.log(`Loading more posts: Current page ${currentPage}, Next page ${nextPage}, Last post ID: ${lastPostId}`);
      
      // Thử cursor-based pagination trước
      if (lastPostId) {
        dispatch(fetchPosts({ page: nextPage, maxId: lastPostId }));
      } else {
        // Fallback to page-based
        dispatch(fetchPosts({ page: nextPage, maxId: null }));
      }
    }
  }, [dispatch, status, hasMore, currentPage, items]);

  // Sử dụng infinite scroll hook với options tùy chỉnh
  const sentinelRef = useInfiniteScroll(
    loadMorePosts,
    hasMore,
    status === "loading",
    {
      rootMargin: "200px", // Tăng lên 200px để trigger sớm hơn
      threshold: 0,        // Trigger ngay khi 1 pixel visible
    }
  );

  const posts = transformPosts(items?.data || []);

  const handleLike = async (postId, newIsLiked) => {
    try {
      // Gọi Redux action để update state và call API
      await dispatch(toggleLike(postId)).unwrap();
    } catch (error) {
      // Error sẽ được handle trong InteractionBar
      console.error("Like action failed:", error);
      throw error; // Re-throw để InteractionBar có thể rollback
    }
  };

  // Debug: Log khi sentinel ref được gắn
  useEffect(() => {
    if (sentinelRef.current) {
      console.log("Sentinel element mounted:", sentinelRef.current);
    }
  }, [sentinelRef]);

  return (
    <div className="flex flex-col">
      <FeedHeader title="Home" />
      {isAuthenticated() && <WhatAreYouThinking />}

      <div>
        {/* Loading cho lần đầu tiên */}
        {status === "loading" && posts.length === 0 && (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-gray-400">Loading posts...</p>
          </div>
        )}

        {/* Hiển thị error */}
        {status === "failed" && (
          <div className="text-center py-10 text-red-500">
            <p>Error loading posts. Please try again.</p>
            <button
              onClick={() => dispatch(fetchPosts(1))}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Hiển thị posts */}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onLike={handleLike} />
        ))}

        {/* Sentinel element để trigger infinite scroll */}
        {hasMore && posts.length > 0 && (
          <div 
            ref={sentinelRef} 
            className="py-8 text-center min-h-[100px]"
            style={{ background: 'transparent' }}
          >
            {status === "loading" && (
              <div>
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-400 text-sm">
                  Loading more posts...
                </p>
              </div>
            )}
            {status !== "loading" && (
              <p className="text-gray-600 text-sm">Scroll to load more...</p>
            )}
          </div>
        )}

        {/* Hiển thị khi đã hết posts */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>You've reached the end! 🎉</p>
          </div>
        )}

        {/* Hiển thị khi không có posts nào */}
        {posts.length === 0 && status === "succeeded" && (
          <div className="text-center py-10 text-gray-400">
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}