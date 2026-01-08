import React, { useState, useEffect } from 'react';
import { 
  Image, 
  Sticker, 
  Smile, 
  List, 
  Hash, 
  MapPin, 
  MoreHorizontal, 
  Copy,
  X
} from 'lucide-react';
import axiosClient from '@/utils/httpRequest';

const CreatePost = ({ user: propUser, onClose, onPostCreated }) => {
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await axiosClient.get('/api/auth/user');
        setUser(userData.data?.user || userData.user || userData.data || userData);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [propUser]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Giới hạn tối đa 4 ảnh
    const newImages = files.slice(0, 4 - images.length);
    setImages(prev => [...prev, ...newImages]);

    // Tạo preview
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      setError('Vui lòng nhập nội dung hoặc thêm ảnh');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      
      // Thêm images nếu có
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axiosClient.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form
      setContent('');
      setImages([]);
      setImagePreviews([]);
      //reset trang
      window.location.reload();
      // Callback để refresh feed
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      // Đóng modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi đăng bài');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[620px] bg-[#181818] rounded-3xl border border-[#2A2A2A] shadow-2xl flex items-center justify-center mx-auto py-20">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const username = user?.username || 'User';
  const displayName = user?.name || username;
  const userId = user?.id || user?._id || "default";
  const avatarUrl = user?.avatar_url || user?.avatar || `https://i.pravatar.cc/150?u=${userId}`;

  return (
    <div className="w-full max-w-[620px] bg-[#181818] rounded-3xl border border-[#2A2A2A] shadow-2xl flex flex-col overflow-hidden mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <button 
          onClick={onClose}
          disabled={submitting}
          className="text-white text-[15px] font-normal hover:opacity-70 transition-opacity disabled:opacity-50"
        >
          Hủy
        </button>
        <h1 className="text-white font-bold text-base">Thread mới</h1>
        <div className="flex gap-4">
          <Copy size={20} className="text-[#4D4D4D] cursor-pointer hover:text-white transition-colors" />
          <MoreHorizontal size={20} className="text-[#4D4D4D] cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <hr className="border-[#2A2A2A]" />

      {/* Content Body */}
      <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
        <div className="flex gap-3">
          {/* Avatar & Line */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] overflow-hidden">
              <img 
                src={avatarUrl}
                alt={`${username}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[2px] grow bg-[#2A2A2A] my-2 rounded-full min-h-[40px]"></div>
            <div className="w-5 h-5 rounded-full bg-[#2A2A2A] overflow-hidden opacity-50">
              <img 
                src={avatarUrl}
                alt="sub-avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[15px] text-white">{username}</span>
              <span className="text-[#4D4D4D] text-[15px] cursor-pointer hover:underline">Thêm chủ đề</span>
            </div>
            
            <textarea 
              placeholder="Có gì mới?" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              className="w-full bg-transparent border-none outline-none text-[15px] text-white placeholder-[#4D4D4D] resize-none min-h-[24px] overflow-hidden disabled:opacity-50"
              rows={1}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
              }}
            />

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-2 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Toolbar Icons */}
            <div className="flex gap-4 mt-3 text-[#4D4D4D]">
              <label className="cursor-pointer hover:text-white transition-colors">
                <Image size={18} />
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden"
                  onChange={handleImageSelect}
                  disabled={submitting || images.length >= 4}
                />
              </label>
              <Sticker size={18} className="hover:text-white cursor-pointer transition-colors" />
              <Smile size={18} className="hover:text-white cursor-pointer transition-colors" />
              <List size={18} className="hover:text-white cursor-pointer transition-colors" />
              <Hash size={18} className="hover:text-white cursor-pointer transition-colors" />
              <MapPin size={18} className="hover:text-white cursor-pointer transition-colors" />
            </div>

            <div className="mt-8 text-[#4D4D4D] text-[14px]">
              Thêm vào thread
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <button className="text-[#4D4D4D] text-[13px] flex items-center gap-2 hover:text-gray-300 transition-colors">
          <span className="border border-[#4D4D4D] rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-bold">⇅</span>
          Các lựa chọn để kiểm soát câu trả lời
        </button>
        <button 
          onClick={handleSubmit}
          disabled={(!content.trim() && images.length === 0) || submitting}
          className={`${
            (content.trim() || images.length > 0) && !submitting
              ? 'bg-[#f3f5f7] text-black opacity-100 cursor-pointer hover:opacity-90' 
              : 'bg-[#f3f5f7] text-black opacity-25 cursor-not-allowed'
          } font-semibold px-5 py-2 rounded-xl text-[15px] transition-opacity`}
        >
          {submitting ? 'Đang đăng...' : 'Đăng'}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;