import FeedHeader from "@/components/FeedHeader";
function notifications() {
  const MOCK_DATA = [
  {
    id: 1,
    user: "myn_lih",
    time: "2 tuần",
    avatar: "https://i.pravatar.cc/150?img=1", // Ảnh đại diện mẫu
    content: "ai ai bày cái trò này để t trêu ảnh v",
    stats: { likes: 170, comments: 6, reposts: 17, shares: 33 }
  },
  {
    id: 2,
    user: "rophimtv",
    time: "3 tuần",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "Chainsaw Man bản đẹp đã lên sóng nha tụi e",
    stats: { likes: 483, comments: 15, reposts: 17, shares: 21 }
  },
  {
    id: 3,
    user: "hina.cuti_",
    time: "4 tuần",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Kiếm bạn đi chơi cùng xong về block nhe :)))",
    stats: { likes: 162, comments: 45, reposts: 1, shares: 1 }
  }
];

// --- CÁC SVG ICON COMPONENTS (Nhúng trực tiếp để không cần cài thư viện) ---
const Icons = {
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Comment: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  ),
  Repost: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
  ),
  Share: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  More: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  )
};

const ThreadPost = ({ post, isLast }) => (
  <div className={`flex p-4  text-white ${!isLast ? 'border-b border-[#2A2A2A]' : ''}`}>
    
    {/* Cột trái: Avatar */}
    <div className="flex flex-col items-center mr-4">
        {/* Avatar có viền mỏng màu xám */}
      <img src={post.avatar} className="w-10 h-10 rounded-full border border-[#2A2A2A]" alt="avatar" />
    </div>

    {/* Cột phải: Nội dung chính */}
    <div className="flex-1">
      {/* Header: Tên, thời gian, nút more */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-[15px] hover:underline cursor-pointer">{post.user}</span>
          <span className="text-[#777777] text-sm font-light">{post.time}</span>
        </div>
        <button className="text-[#777777]">
            <Icons.More />
        </button>
      </div>
      
      {/* Nội dung bài viết - màu trắng ngà */}
      <p className="text-[15px] leading-snug text-[#F3F5F7] mb-3 font-light">{post.content}</p>

      {/* Footer: Các icon tương tác */}
      {/* Sử dụng màu text-[#777777] cho các icon chưa active */}
      <div className="flex gap-5 text-[#777777]">
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <Icons.Heart />
            <span className="text-xs">{post.stats.likes}</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <Icons.Comment />
            <span className="text-xs">{post.stats.comments}</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <Icons.Repost />
            <span className="text-xs">{post.stats.reposts}</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <Icons.Share />
            <span className="text-xs">{post.stats.shares}</span>
        </div>
      </div>
    </div>
  </div>
);
  return (
    <div className="flex flex-col">
      <FeedHeader title="Notifications" />
      <div className="p-4 bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-gray-700 rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]">
<div className="min-h-screen flex justify-center font-sans antialiased">
      {/* Container chính mô phỏng cái khung trong ảnh của bạn */}
      <div className="w-full max-w-[620px] rounded-xl overflow-hidden">
        {MOCK_DATA.map((post, index) => (
          <ThreadPost 
            key={post.id} 
            post={post} 
            isLast={index === MOCK_DATA.length - 1} // Kiểm tra bài cuối để bỏ viền dưới
          />
        ))}
      </div>
    </div>
      </div>
    </div>
  );
}
export default notifications;