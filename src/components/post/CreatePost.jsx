import React from 'react';
import { 
  Image, 
  Sticker, 
  Smile, 
  List, 
  Hash, 
  MapPin, 
  MoreHorizontal, 
  Copy 
} from 'lucide-react';

const ThreadsComposeInner = () => {
  return (
    /* Container chính: 
       - Không dùng fixed/absolute ở đây để Modal component của bạn tự quản lý vị trí.
       - Dùng w-full và max-w để co dãn theo khung của Modal cha.
    */
    <div className="w-full max-w-[620px] bg-[#181818] rounded-3xl border border-[#2A2A2A] shadow-2xl flex flex-col overflow-hidden mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <button className="text-white text-[15px] font-normal hover:opacity-70 transition-opacity">Hủy</button>
        <h1 className="text-white font-bold text-base">Thread mới</h1>
        <div className="flex gap-4">
          <Copy size={20} className="text-[#4D4D4D] cursor-pointer hover:text-white transition-colors" />
          <MoreHorizontal size={20} className="text-[#4D4D4D] cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      <hr className="border-[#2A2A2A]" />

      {/* Content Body: Dùng h-auto và max-h để tránh tạo scrollbar ngoài ý muốn */}
      <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
        <div className="flex gap-3">
          {/* Avatar & Line */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#2A2A2A] overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=minhngo" 
                alt="user-avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[2px] grow bg-[#2A2A2A] my-2 rounded-full min-h-[40px]"></div>
            <div className="w-5 h-5 rounded-full bg-[#2A2A2A] overflow-hidden opacity-50">
               <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=minhngo" 
                alt="sub-avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[15px] text-white">minhngo51104</span>
              <span className="text-[#4D4D4D] text-[15px] cursor-pointer hover:underline">Thêm chủ đề</span>
            </div>
            
            <textarea 
              placeholder="Có gì mới?" 
              className="w-full bg-transparent border-none outline-none text-[15px] text-white placeholder-[#4D4D4D] resize-none min-h-[24px] overflow-hidden"
              rows={1}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
              }}
            />

            {/* Toolbar Icons */}
            <div className="flex gap-4 mt-3 text-[#4D4D4D]">
              <Image size={18} className="hover:text-white cursor-pointer transition-colors" />
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
        <button className="bg-[#f3f5f7] text-black font-semibold px-5 py-2 rounded-xl opacity-25 cursor-not-allowed text-[15px]">
          Đăng
        </button>
      </div>
    </div>
  );
};

export default ThreadsComposeInner;