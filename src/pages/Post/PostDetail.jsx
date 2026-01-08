import { useState, useEffect } from "react";
import { useParams } from "react-router";
import FeedHeader from "@/components/FeedHeader";
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal, Plus, ChevronDown } from 'lucide-react';
import { httpRequest } from "@/utils/httpRequest";

const OriginalPost = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likeCount, setLikeCount] = useState(post?.stats?.likes || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));

      if (newIsLiked) {
        await httpRequest.post(`/api/posts/${post.id}/like`);
      } else {
        await httpRequest.delete(`/api/posts/${post.id}/like`);
      }
      
      if (onLike) onLike(post.id, newIsLiked);
    } catch (error) {
      setIsLiked(!isLiked);
      setLikeCount(prev => !isLiked ? prev + 1 : Math.max(0, prev - 1));
      console.error("Error toggling like:", error);
    }
  };

  if (!post) return null;

  return (
    <div className="p-4 bg-[#181818] rounded-t-[24px] text-white">
      <div className="flex items-start">
        <div className="relative mr-3">
          <img 
            src={post.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user?.name}`} 
            className="w-10 h-10 rounded-full bg-gray-700" 
            alt="avatar"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-black border-2">
            <Plus size={10} className="text-black stroke-[4]" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px]">{post.user?.name}</span>
              <span className="text-gray-500 text-[14px]">{post.time || "vừa xong"}</span>
            </div>
            <MoreHorizontal size={18} className="text-gray-500" />
          </div>
          <p className="text-[15px] mt-1 mb-3 font-light leading-relaxed">{post.content}</p>
          
          {post.images && post.images.length > 0 && (
            <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
              {post.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`Post image ${idx + 1}`}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          )}

          <div className="flex gap-5 text-gray-300">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1.5 hover:text-pink-400 transition"
            >
              <Heart 
                size={18} 
                className={isLiked ? "fill-pink-500 text-pink-500" : ""} 
              />
              <span className="text-xs">{likeCount}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18}/> 
              <span className="text-xs">{post.stats?.comments || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Repeat2 size={18}/> 
              <span className="text-xs">{post.stats?.reposts || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Send size={18}/> 
              <span className="text-xs">{post.stats?.shares || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({ reply, onLikeReply }) => {
  const [isLiked, setIsLiked] = useState(reply?.isLiked || false);
  const [likeCount, setLikeCount] = useState(reply?.stats?.likes || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));

      if (newIsLiked) {
        await httpRequest.post(`/api/posts/${reply.id}/reply/like`);
      } else {
        await httpRequest.delete(`/api/posts/${reply.id}/reply/like`);
      }
      
      if (onLikeReply) onLikeReply(reply.id, newIsLiked);
    } catch (error) {
      setIsLiked(!isLiked);
      setLikeCount(prev => !isLiked ? prev + 1 : Math.max(0, prev - 1));
      console.error("Error toggling reply like:", error);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-[#2a2a2a] text-white">
      <div className="flex items-start">
        <div className="relative mr-3 min-w-[40px]">
          <img 
            src={reply.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user?.name}`} 
            className="w-10 h-10 rounded-full bg-gray-800" 
            alt="avatar" 
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-black border-2">
            <Plus size={10} className="text-black stroke-[4]" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px]">{reply.user?.name}</span>
              <span className="text-gray-500 text-[14px]">{reply.time || "vừa xong"}</span>
            </div>
            <div className="flex items-center gap-3">
              {isLiked && (
                <div className="bg-pink-500/20 p-1 rounded-full">
                  <Heart size={12} className="text-pink-500 fill-pink-500" />
                </div>
              )}
              <MoreHorizontal size={16} className="text-gray-600" />
            </div>
          </div>
          <p className="text-[14px] mt-0.5 mb-2">{reply.content}</p>
          
          {reply.images && reply.images.length > 0 && (
            <img 
              src={reply.images[0]} 
              className="w-full max-w-[300px] rounded-lg mt-2 mb-3 border border-[#2a2a2a] cursor-pointer hover:opacity-90" 
              alt="Reply media"
              onClick={() => window.open(reply.images[0], '_blank')}
            />
          )}

          <div className="flex gap-5 text-gray-400 mt-2">
            <button onClick={handleLike} className="hover:text-pink-400 transition">
              <Heart size={18} className={isLiked ? "fill-pink-500 text-pink-500" : ""} />
            </button>
            <MessageCircle size={18} className="cursor-pointer hover:text-blue-400 transition" />
            <Repeat2 size={18} className="cursor-pointer hover:text-green-400 transition" />
            <Send size={18} className="cursor-pointer hover:text-purple-400 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentInput = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log("Posting comment to post:", postId);
      const response = await httpRequest.post(`/api/posts/${postId}/reply`, {
        content: content.trim()
      });
      console.log("Comment response:", response);
      
      setContent("");
      if (onCommentAdded) onCommentAdded(response.data || response);
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Không thể đăng bình luận. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-[#2a2a2a] bg-[#181818]">
      <div className="flex gap-3">
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=current-user" 
          className="w-10 h-10 rounded-full bg-gray-800" 
          alt="Your avatar" 
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Viết bình luận..."
            className="w-full bg-[#242526] text-white rounded-lg px-3 py-2 text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Đang đăng..." : "Đăng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PostDetail() {
  const params = useParams();
  const postId = params.id || params.postId || params['*'];
  
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("URL Params:", params);
    console.log("Post ID:", postId);
    
    if (!postId) {
      setError("ID bài viết không hợp lệ");
      setLoading(false);
      return;
    }
    fetchPostDetail();
    fetchReplies();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      console.log("Fetching post with ID:", postId);
      const response = await httpRequest.get(`/api/posts/${postId}`);
      console.log("Post response:", response);
      setPost(response.data || response);
      setError(null);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Không thể tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      console.log("Fetching replies for post:", postId);
      const response = await httpRequest.get(`/api/posts/${postId}/replies`);
      console.log("Replies response:", response);
      setReplies(response.data?.data || response.data || []);
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  const handleCommentAdded = (newComment) => {
    setReplies(prev => [newComment, ...prev]);
    if (post) {
      setPost(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          comments: (prev.stats?.comments || 0) + 1
        }
      }));
    }
  };

  if (loading) {
    return (
      <div>
        <FeedHeader title="Post Detail" />
        <div className="flex items-center justify-center h-64 bg-[#181818] border border-[#3a3a3a] rounded-[24px]">
          <div className="text-white">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <FeedHeader title="Post Detail" />
        <div className="flex items-center justify-center h-64 bg-[#181818] border border-[#3a3a3a] rounded-[24px]">
          <div className="text-red-500">{error || "Không tìm thấy bài viết"}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FeedHeader title="Post Detail" />
      <div className="flex flex-col bg-[#181818] border border-[#3a3a3a] rounded-[24px]">
        <OriginalPost post={post} />

        <div className="px-4 py-2 flex justify-between items-center border-y border-[#1a1a1a]">
          <div className="flex items-center text-gray-300 text-[14px] font-bold cursor-pointer">
            Hàng đầu <ChevronDown size={16} className="ml-1" />
          </div>
          <div className="text-gray-500 text-[13px] cursor-pointer hover:underline">
            Xem hoạt động &gt;
          </div>
        </div>

        <CommentInput postId={postId} onCommentAdded={handleCommentAdded} />

        <div className="flex flex-col">
          {replies.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              Chưa có bình luận nào
            </div>
          ) : (
            replies.map((reply) => (
              <CommentItem key={reply.id} reply={reply} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}