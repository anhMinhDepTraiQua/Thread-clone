import { useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Custom hook để implement infinite scroll sử dụng Intersection Observer API
 * 
 * @param {Function} callback - Hàm được gọi khi user scroll đến sentinel element
 * @param {boolean} hasMore - Có còn data để load không
 * @param {boolean} isLoading - Đang loading hay không
 * @param {Object} options - Options cho Intersection Observer
 * @returns {Object} sentinelRef - Ref để gắn vào sentinel element
 */
const useInfiniteScroll = (
  callback,
  hasMore = true,
  isLoading = false,
  options = {}
) => {
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  // Memoize callback để tránh re-create observer
  const memoizedCallback = useCallback(callback, [callback]);
  
  // Memoize options để tránh re-create observer
  const memoizedOptions = useMemo(() => ({
    root: null,
    rootMargin: "200px",
    threshold: 0,
    ...options,
  }), [options.root, options.rootMargin, options.threshold]);

  useEffect(() => {
    console.log("useInfiniteScroll: Setup observer", { hasMore, isLoading });
    
    // Không tạo observer nếu không còn data hoặc đang loading
    if (!hasMore || isLoading) {
      console.log("useInfiniteScroll: Skip observer setup", { hasMore, isLoading });
      return;
    }

    // Callback khi intersection xảy ra
    const handleIntersect = (entries) => {
      const [entry] = entries;
      
      console.log("useInfiniteScroll: Intersection detected", {
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        hasMore,
        isLoading
      });
      
      // CHỈ gọi callback nếu đang succeeded, KHÔNG gọi khi failed
      if (entry.isIntersecting && hasMore && !isLoading) {
        console.log("useInfiniteScroll: Calling callback to load more");
        memoizedCallback();
      }
    };

    // Tạo observer
    observerRef.current = new IntersectionObserver(
      handleIntersect,
      memoizedOptions
    );

    // Observe sentinel element
    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      console.log("useInfiniteScroll: Observing sentinel element", currentSentinel);
      observerRef.current.observe(currentSentinel);
    } else {
      console.warn("useInfiniteScroll: Sentinel element not found!");
    }

    // Cleanup
    return () => {
      if (observerRef.current && currentSentinel) {
        console.log("useInfiniteScroll: Cleanup observer");
        observerRef.current.unobserve(currentSentinel);
      }
    };
  }, [hasMore, isLoading, memoizedCallback, memoizedOptions]);

  return sentinelRef;
};

export default useInfiniteScroll;