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

const ReplyModal = ({ postId, onClose, onReplySuccess }) => {
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [postData, setPostData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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
    fetchCurrentUser();
  }, [postId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [replyContent]);

  const fetchPostData = async () => {
    try {
      console.log(`Fetching post data for postId: ${postId}`);
      const response = await fetch(`/api/posts/${postId}/replies`);
      console.log('Post data response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Post data received:', data);
      setPostData(data);
    } catch (error) {
      console.error("Error fetching post data:", error);
      // Set mock data for testing if API fails
      setPostData({
        user: {
          username: "stecentmalta",
          avatar: null,
        },
        content: "The worst part of me having voice notes is I fucking hate my voice.",
        createdAt: "1d",
        hasVoiceNote: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      console.log('Fetching current user data');
      const response = await fetch("/api/user/me");
      console.log('Current user response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Current user data received:', data);
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      // Set mock data for testing if API fails
      setCurrentUser({
        username: "sondang2770",
        avatar: null,
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages([...selectedImages, ...newImages]);
    console.log(`Added ${files.length} images. Total: ${selectedImages.length + files.length}`);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    console.log(`Removed image at index ${index}. Remaining: ${newImages.length}`);
  };

  const handleEmojiSelect = (emoji) => {
    setReplyContent(replyContent + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
    console.log(`Emoji added: ${emoji}`);
  };

  const handlePost = async () => {
    if (!replyContent.trim() && selectedImages.length === 0) {
      console.log('Cannot post: No content or images');
      return;
    }

    setPosting(true);
    console.log('Starting post submission...');
    console.log('Content:', replyContent);
    console.log('Topic:', topic);
    console.log('Reply option:', replyOption);
    console.log('Images:', selectedImages.length);

    try {
      const formData = new FormData();
      formData.append("content", replyContent);
      if (topic) formData.append("topic", topic);
      formData.append("replyOption", replyOption);

      selectedImages.forEach((img, index) => {
        formData.append(`images`, img.file);
      });

      console.log(`Posting reply to /api/posts/${postId}/reply`);
      const response = await fetch(`/api/posts/${postId}/reply`, {
        method: "POST",
        body: formData,
      });

      console.log('Post response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Post successful:', result);

      // Cleanup
      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));

      // Success callback
      if (onReplySuccess) {
        console.log('Calling onReplySuccess callback');
        onReplySuccess();
      }
      
      console.log('Closing modal');
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <button
          className="text-[16px] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          onClick={() => {
            console.log('Cancel button clicked');
            onClose();
          }}
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

      {/* Main */}
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        {/* Original post */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src={
                  postData?.user?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${postData?.user?.username}`
                }
                alt={postData?.user?.username}
              />
            </div>
            <div className="w-[2px] grow bg-gray-200 dark:bg-gray-700 my-1"></div>
          </div>

          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">
                {postData?.user?.username || "stecentmalta"}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-[14px]">
                {postData?.createdAt || "1d"}
              </span>
            </div>

            <p className="text-[15px] mt-0.5">
              {postData?.content ||
                "The worst part of me having voice notes is I fucking hate my voice."}
            </p>

            {/* Voice note or media */}
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
          </div>
        </div>

        {/* Reply */}
        <div className="flex gap-3 mt-1">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.username} />
              ) : (
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username || "user"}`}
                  alt="You"
                />
              )}
            </div>
            <div className="w-[2px] grow bg-gray-200 dark:bg-gray-700 my-1" />
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 mt-1" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">
                {currentUser?.username || "sondang2770"}
              </span>
              <button
                className="text-gray-400 dark:text-gray-500 text-[14px] hover:underline cursor-pointer"
                onClick={() => {
                  const newTopic = prompt("Enter a topic:");
                  if (newTopic) {
                    setTopic(newTopic);
                    console.log('Topic set:', newTopic);
                  }
                }}
              >
                {topic ? topic : "Add a topic"}
              </button>
            </div>

            <textarea
              ref={textareaRef}
              className="w-full bg-transparent text-[15px] mt-1 resize-none outline-none min-h-[60px] text-black dark:text-white"
              placeholder={`Reply to ${postData?.user?.username || "stecentmalta"}...`}
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
                console.log('Content length:', e.target.value.length);
              }}
              disabled={posting}
            />

            {/* Image Previews */}
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

            {/* Toolbar */}
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
                onClick={() => {
                  console.log('Image upload button clicked');
                  fileInputRef.current?.click();
                }}
                disabled={posting}
                title="Upload image/video"
              >
                <Image
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>

              <button 
                disabled={posting} 
                title="Add GIF"
                onClick={() => console.log('GIF button clicked')}
              >
                <Film
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>

              <button
                onClick={() => {
                  console.log('Emoji picker toggled');
                  setShowEmojiPicker(!showEmojiPicker);
                }}
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

              <button 
                disabled={posting} 
                title="Create poll"
                onClick={() => console.log('Poll button clicked')}
              >
                <List
                  size={20}
                  className="hover:text-black dark:hover:text-white cursor-pointer transition"
                />
              </button>

              <button 
                disabled={posting} 
                title="Add location"
                onClick={() => console.log('Location button clicked')}
              >
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

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="relative">
          <button
            onClick={() => {
              console.log('Reply options toggled');
              setShowReplyOptions(!showReplyOptions);
            }}
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
                  console.log('Reply option set to: everyone');
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
                  console.log('Reply option set to: following');
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
                  console.log('Reply option set to: mentioned');
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