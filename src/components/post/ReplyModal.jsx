import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  Smile,
  List,
  MapPin,
  MoreHorizontal,
  Play,
  Film,
  X,
} from "lucide-react";
import axios from "@/utils/httpRequest";

const ReplyModal = ({ postId, currentUser, onClose, onReplySuccess }) => {
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [postData, setPostData] = useState(null);
  const [user, setUser] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplyOptions, setShowReplyOptions] = useState(false);
  const [replyOption, setReplyOption] = useState("everyone");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    fetchPostData();
    fetchCurrentUser();
  }, [postId]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await axios.get('/api/auth/user');
      const userInfo = userData.data?.user || userData.user || userData.data || userData;
      console.log('🔍 ReplyModal - Fetched user:', userInfo);
      setUser(userInfo);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [replyContent]);

  const fetchPostData = async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      setPostData(response.data);
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleEmojiSelect = (emoji) => {
    setReplyContent(replyContent + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handlePost = async () => {
    if (!replyContent.trim() && selectedImages.length === 0) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("content", replyContent);
      if (topic) formData.append("topic", topic);
      formData.append("replyOption", replyOption);
      selectedImages.forEach((img) => formData.append(`images`, img.file));

      await axios.post(`/api/posts/${postId}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      if (onReplySuccess) onReplySuccess();
      onClose();
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply.");
    } finally {
      setPosting(false);
    }
  };

  const emojis = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "✨", "💯"];
  const isPostDisabled = !replyContent.trim() && selectedImages.length === 0;

  // Avatar URLs - luôn sử dụng username để đảm bảo consistency
  const postAuthorId = postData?.author?.username || postData?.author?.email || postData?.author?.id || postData?.author?._id || "post-author";
  const postAuthorAvatar = postData?.author?.avatar_url || postData?.author?.avatar || `https://i.pravatar.cc/150?u=${postAuthorId}`;
  
  const currentUserId = user?.username || user?.email || user?.id || user?._id || "current-user";
  const currentUserAvatar = user?.avatar_url || user?.avatar || `https://i.pravatar.cc/150?u=${currentUserId}`;
  
  console.log('🎨 ReplyModal Avatar Debug:', {
    username: user?.username,
    email: user?.email,
    id: user?.id,
    userId: currentUserId,
    avatarUrl: currentUserAvatar
  });

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-[620px] bg-white dark:bg-[#101113] rounded-3xl p-8 text-center border border-gray-800">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-hidden"
      onClick={onClose} 
    >
      <div 
        className="w-full max-w-[620px] min-w-[320px] sm:min-w-[620px] bg-white text-black dark:bg-[#101113] dark:text-white rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <button className="text-[16px] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition" onClick={onClose} disabled={posting}>
            Cancel
          </button>
          <h1 className="font-bold text-[16px]">Reply</h1>
          <MoreHorizontal size={20} className="cursor-pointer text-gray-500 dark:text-gray-400" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar { display: none; }`}} />
          
          <div className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img src={postAuthorAvatar} className="w-full h-full object-cover" alt="avatar" />
              </div>
              <div className="w-[2px] grow bg-gray-200 dark:bg-gray-700 my-1"></div>
            </div>
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14px] truncate">{postData?.author?.username || postData?.author?.name}</span>
                <span className="text-gray-400 text-[14px] flex-shrink-0">{postData?.createdAt || "1d"}</span>
              </div>
              <p className="text-[15px] mt-0.5 break-words whitespace-pre-wrap">{postData?.content}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img src={currentUserAvatar} className="w-full h-full object-cover" alt="avatar" />
              </div>
              <div className="w-[2px] grow bg-gray-200 dark:bg-gray-700 my-1" />
              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 mt-1" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14px]">{user?.username || user?.name}</span>
                <button className="text-gray-400 text-[14px] hover:underline" onClick={() => setTopic(prompt("Enter topic:"))}>
                  {topic ? topic : "Add a topic"}
                </button>
              </div>

              <textarea
                ref={textareaRef}
                className="w-full bg-transparent text-[15px] mt-1 resize-none outline-none min-h-[60px] break-words"
                placeholder={`Reply to ${postData?.author?.username}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={posting}
              />

              <div className="flex gap-4 mt-4 text-gray-400 relative">
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleImageUpload} />
                <Image size={20} className="cursor-pointer hover:text-white transition" onClick={() => fileInputRef.current?.click()} />
                <Film size={20} className="cursor-pointer hover:text-white" />
                <Smile size={20} className="cursor-pointer hover:text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                <List size={20} className="cursor-pointer hover:text-white" />
                <MapPin size={20} className="cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-[#101113]">
          <button onClick={() => setShowReplyOptions(!showReplyOptions)} className="text-gray-500 text-[14px] flex items-center gap-2">
            <div className="border border-gray-600 rounded-md w-5 h-5 flex items-center justify-center text-[10px]">⇅</div>
            Reply options
          </button>
          <button
            onClick={handlePost}
            disabled={isPostDisabled || posting}
            className={`font-bold px-6 py-2 rounded-xl text-[15px] transition ${
              isPostDisabled || posting ? "bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;