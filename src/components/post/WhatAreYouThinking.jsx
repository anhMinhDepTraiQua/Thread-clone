function whatAreYouThinking() {
  return (
    <div className="px-[24px] py-[16px] bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-neutral-700 rounded-tl-[20px] rounded-br-[0] rounded-tr-[20px] rounded-bl-[0]">
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full inline-block">
            <img src="" alt="" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <span className="ml-2 text-gray-500 dark:text-gray-400 w-[300px] cursor-pointer">What are you thinking?</span>
        </div>
        <button className="border border-neutral-700 cursor-pointer text-white px-4 py-1 rounded-[10px] text-sm">Post</button>
      </div>
    </div>
  );
}
export default whatAreYouThinking;
