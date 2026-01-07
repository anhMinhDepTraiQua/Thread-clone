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
  const [replyContent, setReplyContent] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplyOptions, setShowReplyOptions] = useState(false);
  const [replyOption, setReplyOption] = useState("everyone");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

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

      selectedImages.forEach((img) => {
        formData.append(`images`, img.file);
      });

      await axios.post(`/api/posts/${postId}/reply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));

      if (onReplySuccess) {
        onReplySuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const emojis = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "✨", "💯"];

  const isPostDisabled = !replyContent.trim() && selectedImages.length === 0;

  if (loading) {
    return (
      <div className="w-full max-w-[620px] mx-auto bg-white dark:bg-[#101113] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-8 text-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[620px] mx-auto bg-white text-black dark:bg-[#101113] dark:text-white rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden font-sans">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <button
          className="text-[16px] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          onClick={onClose}
          disabled={posting}
        >
          Cancel
        </button>

        <h1 className="font-bold text-[16px]">Reply</h1>

        <MoreHorizontal
          size={20}
          className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        />
      </div>

      <div className="p-4 max-h-[70vh] overflow-y-auto">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src={
                  postData?.author?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${postData?.author?.username || postData?.author?.name}`
                }
                alt={postData?.author?.username || postData?.author?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[2px] grow bg-gray-200 dark:bg-gray-700 my-1"></div>
          </div>

          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">
                {postData?.author?.username || postData?.author?.name}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-[14px]">
                {postData?.createdAt || "1d"}
              </span>
            </div>

            <p className="text-[15px] mt-0.5">
              {postData?.content || ""}
            </p>

            {postData?.hasVoiceNote && (
              <div className="mt-3 bg-gray-100 dark:bg-[#18191c] border border-gray-200 dark:border-gray-800 rounded-2xl p-3 flex items-center gap-3 w-fit pr-8">
                <Play
                  size={16}
                  className="text-black dark:text-white"
                  fill="currentColor"
                />
                <div className="flex items-end gap-[2px] h-6">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[2px] bg-gray-400 dark:bg-gray-500 rounded-full"
                      style={{
                        height: `${Math.random() * 100}%`,
                        minHeight: "4px",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {postData?.images && postData.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {postData.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Post"
                    className="max-w-full rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-1">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src={
                  currentUser?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || currentUser?.name}`
                }
                alt={currentUser?.username || currentUser?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[2px] grow bg-gray-200 dark:bg-gray-700 my-1" />
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 mt-1" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">
                {currentUser?.username || currentUser?.name}
              </span>
              <button
                className="text-gray-400 dark:text-gray-500 text-[14px] hover:underline cursor-pointer"
                onClick={() => {
                  const newTopic = prompt("Enter a topic:");
                  if (newTopic) setTopic(newTopic);
                }}
              >
                {topic ? topic : "Add a topic"}
              </button>
            </div>

            <textarea
              ref={textareaRef}
              className="w-full bg-transparent text-[15px] mt-1 resize-none outline-none min-h-[60px] text-black dark:text-white"
              placeholder={`Reply to ${postData?.author?.username || postData?.author?.name}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              disabled={posting}
            />

            {selectedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-4 text-gray-400 dark:text-gray-500 relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={posting}
                title="Upload image/video"
              >
                <Image
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>

              <button disabled={posting} title="Add GIF">
                <Film
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>

              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={posting}
                title="Add emoji"
              >
                <Smile
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>

              {showEmojiPicker && (
                <div className="absolute top-8 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg z-10 flex gap-2">
                  {emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-2xl hover:scale-125 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <button disabled={posting} title="Create poll">
                <List
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>

              <button disabled={posting} title="Add location">
                <MapPin
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>
            </div>

            <div className="mt-6 text-gray-300 dark:text-gray-600 text-[14px]">
              Add to thread
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="relative">
          <button
            onClick={() => setShowReplyOptions(!showReplyOptions)}
            disabled={posting}
            className="text-gray-400 dark:text-gray-500 text-[14px] flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-lg transition"
          >
            <div className="border border-gray-300 dark:border-gray-600 rounded-md w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              ⇅
            </div>
            Reply options
          </button>

          {showReplyOptions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 w-48 z-10">
              <button
                onClick={() => {
                  setReplyOption("everyone");
                  setShowReplyOptions(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-[14px] hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  replyOption === "everyone" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
              >
                Everyone can reply
              </button>
              <button
                onClick={() => {
                  setReplyOption("following");
                  setShowReplyOptions(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-[14px] hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  replyOption === "following" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
              >
                People you follow
              </button>
              <button
                onClick={() => {
                  setReplyOption("mentioned");
                  setShowReplyOptions(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-[14px] hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  replyOption === "mentioned" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
              >
                Mentioned only
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handlePost}
          disabled={isPostDisabled || posting}
          className={`font-bold px-6 py-2 rounded-xl text-[15px] transition ${
            isPostDisabled || posting
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 cursor-not-allowed"
              : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default ReplyModal;