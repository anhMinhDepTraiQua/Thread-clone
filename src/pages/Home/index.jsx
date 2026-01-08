import React, { useEffect, useCallback, useRef } from "react";
import PostCard from "@/components/post/PostCard";
import WhatAreYouThinking from "@/components/post/WhatAreYouThinking";
import FeedHeader from "@/components/FeedHeader";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, toggleLike, resetPosts } from "@/components/post/postsSlice";

function transformPosts(apiPosts = []) {
  return apiPosts.map((p) => {
    // Xử lý media urls
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

    // Phân loại media
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
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  // ✅ TRANSFORM POSTS TRƯỚC KHI SỬ DỤNG
  const posts = transformPosts(items?.data || []);

  // Debug: Log Redux state - THROTTLE để tránh spam
  useEffect(() => {
    console.log("📊 Redux State Changed:", { 
      currentPage: currentPage, 
      currentPageType: typeof currentPage,
      hasMore, 
      status, 
      postsCount: items?.data?.length,
      firstPostId: items?.data?.[0]?.id,
      lastPostId: items?.data?.[items.data?.length - 1]?.id
    });
  }, [currentPage, hasMore, status, items?.data?.length]); // ✅ Chỉ log khi các giá trị này thay đổi

  // ✅ Reset và load initial posts - CHỈ CHẠY 1 LẦN khi mount
  useEffect(() => {
    console.log("🔄 Component mounted - Resetting and loading initial posts");
    dispatch(resetPosts());
    dispatch(fetchPosts({ page: 1, maxId: null }));
    
    // Cleanup function
    return () => {
      console.log("🧹 Component unmounting");
    };
  }, []); // ✅ EMPTY DEPS - chỉ chạy 1 lần khi mount

  // ✅ Callback để load thêm posts
  const loadMorePosts = useCallback(() => {
    if (status === "loading") {
      console.log("⚠️ Already loading, skip");
      return;
    }
    
    if (!hasMore) {
      console.log("⚠️ No more posts, skip");
      return;
    }

    const currentPageNum = Number(currentPage) || 0;
    const nextPage = currentPageNum + 1;
    
    console.log(`🔄 loadMorePosts triggered:`, {
      currentPage,
      currentPageNum,
      nextPage,
      hasMore,
      status
    });
    
    if (isNaN(nextPage) || nextPage < 1) {
      console.error("❌ Invalid nextPage:", nextPage);
      return;
    }
    
    const lastPostId = items?.data?.[items.data.length - 1]?.id;
    console.log(`📤 Dispatching fetchPosts for page ${nextPage}, lastPostId: ${lastPostId}`);
    
    dispatch(fetchPosts({ page: nextPage, maxId: lastPostId }));
  }, [dispatch, status, hasMore, currentPage, items]);

  // ✅ Setup Intersection Observer manually
  useEffect(() => {
    console.log("🔧 Observer useEffect triggered:", {
      hasMore,
      status,
      hasSentinel: !!sentinelRef.current,
      currentPage,
      postsCount: items?.data?.length // ✅ Sử dụng items.data.length
    });

    // Cleanup previous observer
    if (observerRef.current) {
      console.log("🧹 Disconnecting previous observer");
      observerRef.current.disconnect();
    }

    // Don't observe if no more posts or no sentinel
    if (!hasMore) {
      console.log("⚠️ Not setting up observer: hasMore is false");
      return;
    }

    if (!sentinelRef.current) {
      console.log("⚠️ Not setting up observer: sentinel ref is null");
      return;
    }

    console.log("👁️ Setting up NEW Intersection Observer");

    const options = {
      root: null,
      rootMargin: "300px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      console.log("👁️ Observer callback triggered:", {
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        hasMore,
        status,
        currentPage
      });

      if (entry.isIntersecting && hasMore && status !== "loading") {
        console.log("✅ Conditions met - Calling loadMorePosts");
        loadMorePosts();
      } else {
        console.log("⏸️ Skipping load:", {
          isIntersecting: entry.isIntersecting,
          hasMore,
          status,
          reason: !entry.isIntersecting ? "not intersecting" : 
                  !hasMore ? "no more posts" : 
                  status === "loading" ? "already loading" : "unknown"
        });
      }
    }, options);

    observer.observe(sentinelRef.current);
    observerRef.current = observer;

    console.log("✅ Observer setup complete");

    return () => {
      if (observerRef.current) {
        console.log("🧹 Cleaning up observer");
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, status, loadMorePosts, currentPage, items?.data?.length]); // ✅ Dependency sử dụng items.data.length thay vì posts.length

  const handleLike = async (postId, newIsLiked) => {
    try {
      await dispatch(toggleLike(postId)).unwrap();
    } catch (error) {
      console.error("❌ Like action failed:", error);
      throw error;
    }
  };

  const handleRetry = () => {
    console.log("🔄 Manual retry - Loading page 1");
    dispatch(fetchPosts({ page: 1, maxId: null }));
  };

  return (
    <div className="flex flex-col">
      <FeedHeader title="Home" />
      {isAuthenticated() && <WhatAreYouThinking />}

      <div>
        {/* Loading lần đầu */}
        {status === "loading" && posts.length === 0 && (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-gray-400">Loading posts...</p>
          </div>
        )}

        {/* Error */}
        {status === "failed" && (
          <div className="text-center py-10 text-red-500">
            <p>Error loading posts. Please try again.</p>
            <button
              onClick={handleRetry}
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

        {/* Sentinel element - ✅ Luôn hiển thị khi có posts, hide bằng CSS nếu !hasMore */}
        {posts.length > 0 && hasMore && (
          <div 
            ref={sentinelRef} 
            className="py-8 text-center min-h-[150px]"
            style={{ 
              background: 'transparent',
            }}
          >
            {status === "loading" ? (
              <div>
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-400 text-sm">
                  Loading more posts...
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-sm mb-3">Scroll to load more...</p>
                {/* ✅ DEBUG: Manual load button */}
                <button
                  onClick={() => {
                    console.log("🔘 Manual Load More button clicked");
                    loadMorePosts();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Load More (Debug)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hết posts */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-10 text-gray-400">
            <p>You've reached the end! 🎉</p>
          </div>
        )}

        {/* Không có posts */}
        {posts.length === 0 && status === "succeeded" && (
          <div className="text-center py-10 text-gray-400">
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}