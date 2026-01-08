import React, { useState, useEffect } from 'react';
import { ChevronRight, Lock, X, Upload, AlertCircle } from 'lucide-react';
import axios from 'axios';

const EditProfileRow = ({ label, value, subtext, hasArrow, isLock, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-start justify-between py-4 border-b border-[#2A2A2A] cursor-pointer hover:bg-[#101010] transition-colors px-1"
  >
    <div className="flex-1">
      <div className="flex items-center gap-1.5 mb-0.5">
        {isLock && <Lock size={14} className="text-white" />}
        <span className="text-white font-bold text-[15px]">{label}</span>
      </div>
      {value && <div className="text-white text-[15px]">{value}</div>}
      {subtext && <div className="text-[#4D4D4D] text-[13px] mt-2 leading-snug">{subtext}</div>}
    </div>
    <div className="flex items-center gap-2 mt-1">
      {hasArrow && <ChevronRight size={20} className="text-[#4D4D4D]" />}
    </div>
  </div>
);

const EditProfileModal = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Edit mode states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://threads.f8team.dev/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      const userInfo = userData.data?.user || userData.user || userData.data || userData;
      
      setUser(userInfo);
      setName(userInfo?.name || '');
      setUsername(userInfo?.username || '');
      setBio(userInfo?.bio || '');
      
      // Sử dụng pravatar với username/email để đồng bộ
      const userId = userInfo?.username || userInfo?.email || userInfo?.id || userInfo?._id || "default";
      const defaultAvatar = `https://i.pravatar.cc/150?u=${userId}`;
      setAvatarPreview(userInfo?.avatar_url || userInfo?.avatar || defaultAvatar);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ảnh không được vượt quá 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    
    try {
      // Kiểm tra xem có thay đổi gì không
      const hasNameChange = name !== user?.name && name.trim();
      const hasBioChange = bio !== (user?.bio || '');
      const hasAvatarChange = avatarFile !== null;

      if (!hasNameChange && !hasBioChange && !hasAvatarChange) {
        setError('Không có thay đổi nào để lưu');
        setSaving(false);
        return;
      }

      // Tạo FormData theo đúng format API yêu cầu
      const formData = new FormData();
      
      // Thêm _method = PUT (Laravel style)
      formData.append('_method', 'PUT');
      
      // QUAN TRỌNG: Chỉ thêm các field đã thay đổi
      if (hasNameChange) {
        formData.append('name', name.trim());
      }
      
      // Username không đổi
      formData.append('username', username.trim());
      
      if (hasBioChange) {
        formData.append('bio', bio.trim());
      }
      
      // TẠM THỜI BỎ QUA AVATAR để test trước (vì backend thiếu S3 config)
      if (hasAvatarChange) {
        // Comment out để tạm thời không upload
        // formData.append('avatar', avatarFile);
        
        // Hiển thị thông báo
        setError('Tính năng upload avatar tạm thời chưa khả dụng (Backend thiếu S3 config). Chỉ cập nhật tên và bio.');
      }

      // Log FormData (for debugging)
      console.log('📤 Sending FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
      }

      const token = localStorage.getItem('accessToken');
      
      // Gửi request với axios
      const response = await axios.post(
        'https://threads.f8team.dev/api/auth/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log('✅ Profile updated:', response.data);
      
      // Cập nhật localStorage với thông tin mới
      const updatedUser = response.data.data?.user || response.data.user || response.data.data || response.data;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Đóng modal
      if (onClose) onClose();
      
      // Reload để cập nhật UI
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Không thể cập nhật profile. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[620px] mx-auto bg-black text-white p-4 rounded-3xl border border-[#2A2A2A] shadow-2xl">
        <div className="flex items-center justify-center py-20">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  const displayName = name || username || 'User';

  return (
    <div className="w-full max-w-[620px] mx-auto bg-black text-white p-4 rounded-3xl border border-[#2A2A2A] shadow-2xl overflow-hidden">
      
      {/* Header với nút Close */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-xl">Chỉnh sửa trang cá nhân</h2>
        {onClose && (
          <button onClick={onClose} className="text-[#4D4D4D] hover:text-white transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Error/Warning Message */}
      <div className={`mb-4 overflow-hidden transition-all duration-300 ease-in-out ${error ? 'max-h-40 py-3' : 'max-h-0 py-0'}`}>
        <div className={`${error ? (error?.includes('tạm thời') ? 'bg-yellow-900/20 border border-yellow-500' : 'bg-red-900/20 border border-red-500') : ''} rounded-lg p-3 flex items-start gap-2 transform transition-all duration-200 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <AlertCircle size={20} className={error?.includes('tạm thời') ? 'text-yellow-500' : 'text-red-500'} />
          <div className="flex-1">
            <p className={`${error?.includes('tạm thời') ? 'text-yellow-500' : 'text-red-500'} text-sm`}>{error || ''}</p>
          </div>
          <button onClick={() => setError(null)} className={`${error?.includes('tạm thời') ? 'text-yellow-500' : 'text-red-500'}`} aria-label="Close alert">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 1. Header Section với Avatar */}
      <div className="flex justify-between items-center py-4 border-b border-[#2A2A2A]">
        <div className="flex-1">
          {isEditingName ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Lock size={14} className="text-white" />
                <span className="text-white font-bold text-[15px]">Tên</span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#2A2A2A] outline-none focus:border-white"
                placeholder="Nhập tên của bạn"
                autoFocus
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingName(false);
                }}
              />
              <div className="text-[#4D4D4D] text-[13px]">@{username}</div>
            </div>
          ) : (
            <div onClick={() => setIsEditingName(true)} className="cursor-pointer">
              <div className="flex items-center gap-1.5">
                <Lock size={14} className="text-white" />
                <span className="text-white font-bold text-[15px]">Tên</span>
              </div>
              <div className="text-white text-[15px] mt-1">{displayName} (@{username})</div>
            </div>
          )}
        </div>
        <div className="relative group">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-[#2A2A2A]">
            <img 
              src={avatarPreview}
              alt="profile" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Tạm thời disable upload avatar */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed"
            title="Tính năng upload avatar tạm thời chưa khả dụng"
          >
            <Upload size={20} className="text-gray-500" />
          </div>
          <label 
            htmlFor="avatar-upload" 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Upload size={20} className="text-white" />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      {/* 2. Tiểu sử */}
      {isEditingBio ? (
        <div className="py-4 border-b border-[#2A2A2A]">
          <div className="text-white font-bold text-[15px] mb-2">Tiểu sử</div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#2A2A2A] outline-none focus:border-white resize-none"
            placeholder="Viết gì đó về bạn..."
            rows={3}
            maxLength={150}
            autoFocus
            onBlur={() => setIsEditingBio(false)}
          />
          <div className="text-[#4D4D4D] text-xs mt-1 text-right">{bio.length}/150</div>
        </div>
      ) : (
        <EditProfileRow 
          label="Tiểu sử" 
          value={bio || 'Thêm tiểu sử'}
          onClick={() => setIsEditingBio(true)}
        />
      )}

      {/* 3. Các trường khác (tạm thời disabled) */}
      <div className="opacity-50 pointer-events-none">
        <EditProfileRow 
          label="Cộng đồng và mối quan tâm" 
          value={<span className="text-[#4D4D4D]">Sắp ra mắt</span>}
        />

        <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A] px-1">
          <span className="text-white font-bold text-[15px]">Liên kết</span>
          <div className="flex items-center gap-2">
            <span className="text-[#4D4D4D] text-[15px]">0</span>
            <ChevronRight size={20} className="text-[#4D4D4D]" />
          </div>
        </div>

        <EditProfileRow 
          label="Podcast" 
          value={<span className="text-[#4D4D4D] text-[15px]">+ Liên kết đến podcast của bạn</span>}
        />

        <div className="flex items-center justify-between py-6 border-b border-[#2A2A2A] px-1">
          <span className="text-white font-bold text-[15px]">Hiển thị biểu tượng Instagram</span>
          <div className="w-12 h-7 bg-gray-600 rounded-full relative p-1 cursor-not-allowed">
            <div className="w-5 h-5 bg-black rounded-full absolute left-1"></div>
          </div>
        </div>

        <EditProfileRow 
          label="Quyền riêng tư của trang cá nhân" 
          value={<div className="flex justify-between w-full">
            <span className="opacity-0">.</span>
            <span className="text-[#4D4D4D] text-[14px] flex items-center gap-1">Công khai <ChevronRight size={18}/></span>
          </div>}
          subtext="Nếu bạn chuyển sang chế độ riêng tư, chỉ người theo dõi mới có thể nhìn thấy thread của bạn."
        />
      </div>

      {/* 5. Footer Button */}
      <div className="mt-8 pb-4 px-1">
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`w-full bg-white text-black font-bold py-3.5 rounded-2xl text-[16px] transition-colors ${
            saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
          }`}
        >
          {saving ? 'Đang lưu...' : 'Xong'}
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;