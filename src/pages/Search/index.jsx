import FeedHeader from "@/components/FeedHeader";
import { Search, Settings2, CheckCircle2 } from 'lucide-react';
function search() {
  const SuggestionItem = ({ username, displayName, bio, followers, avatar, isVerified }) => (
  <div className="flex gap-3 py-4 border-b border-[#2A2A2A] last:border-none">
    {/* Avatar */}
    <div className="shrink-0">
      <div className="w-10 h-10 rounded-full bg-[#2A2A2A] overflow-hidden">
        <img src={avatar} alt={username} className="w-full h-full object-cover" />
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px] text-white hover:underline cursor-pointer truncate">
              {username}
            </span>
            {isVerified && <CheckCircle2 size={14} className="text-[#1d9bf0] fill-current" />}
          </div>
          <div className="text-[#4D4D4D] text-[15px] truncate">{displayName}</div>
        </div>
        
        <button className="bg-white text-black font-semibold px-4 py-1.5 rounded-xl text-[14px] hover:bg-[#e2e2e2] transition-colors shrink-0">
          Theo dõi
        </button>
      </div>

      <div className="mt-1 text-[15px] text-white leading-normal whitespace-pre-line">
        {bio}
      </div>

      <div className="mt-3 flex items-center gap-2">
         {/* Nhóm avatar nhỏ cho follower (nếu có) */}
         <div className="flex -space-x-2">
            <div className="w-4 h-4 rounded-full border border-black bg-gray-500"></div>
         </div>
         <span className="text-[#4D4D4D] text-[14px]">{followers} người theo dõi</span>
      </div>
    </div>
  </div>
);

const SuggestionList = () => {
  const suggestions = [
    {
      username: "hawkinsavclubvn",
      displayName: "From Hawkins AV Club to Hellfire",
      bio: "viết lại kịch bản Stranger Things",
      followers: "818",
      isVerified: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=stranger"
    },
    {
      username: "mens_outfit_04",
      displayName: "Mens | Fashion | Outfit",
      bio: "• Daily men's fashion & outfit ideas\n• men's fashion | lifestyle | tips & guides\n• Follow for the best outfit ideas...",
      followers: "24,4K",
      isVerified: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fashion"
    },
    {
      username: "_daiphatthanh",
      displayName: "Đài Phát Thanh.",
      bio: "Đài Phát Thanh. trên Threads",
      followers: "93,8K",
      isVerified: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=radio"
    }
  ];
  return (
    <div className="flex flex-col">
      <FeedHeader title="Search" />
        <div className="p-4 bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-gray-700 rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]">
          <div className="relative mb-4">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#4D4D4D]">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Tìm kiếm"
          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl py-3 pl-12 pr-12 text-white placeholder-[#4D4D4D] outline-none focus:border-[#444]"
        />
        <div className="absolute inset-y-0 right-4 flex items-center text-[#4D4D4D] cursor-pointer">
          <Settings2 size={18} />
        </div>
      </div>

      <h2 className="text-[#4D4D4D] text-[15px] font-normal mb-2 px-1">Gợi ý theo dõi</h2>

      {/* List Container */}
      <div className="flex flex-col">
        {suggestions.map((item, index) => (
          <SuggestionItem key={index} {...item} />
        ))}
      </div>
        </div>
    </div>
  );
}
  return <SuggestionList />;
}
export default search;