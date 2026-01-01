export default function FeedHeader({ title }) {
  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-[rgb(16,16,16)]">
      {/* Title */}
      <h1 className="text-lg font-semibold text-center p-[16px]">
        {title}
      </h1>

      {/* Border bottom (chỉ hiện khi scroll) */}
      <div
        className={`absolute left-[25px] bottom-0 h-[10px] w-[calc(100%-50px)]
          border-b border-neutral-300 dark:border-neutral-700
          transition-opacity duration-200
        `}
      />

      {/* Left corner */}
      <div className="absolute top-[34px] -left-[25px] w-[50px] h-[50px] overflow-hidden">
        <div className="relative top-[25px] left-[25px] w-[50px] h-[50px] rounded-full border border-neutral-300 dark:border-neutral-700 outline outline-[50px] outline-white dark:outline-[rgb(16,16,16)]" />
      </div>

      {/* Right corner */}
      <div className="absolute top-[34px] -right-[25px] w-[50px] h-[50px] overflow-hidden ">
        <div className="relative top-[25px] right-[25px] w-[50px] h-[50px] rounded-full border border-neutral-300 dark:border-neutral-700 outline outline-[50px] outline-white dark:outline-[rgb(16,16,16)]" />
      </div>
    </div>
  );
}
