export default function RightPanel() {
  return (
    <div className="fixed top-15 z-100">
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-6 shadow-sm text-center border border-neutral-700">
        <h3 className="font-semibold text-lg">
          Log in or sign up for Threads
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          See what people are talking about and <br />
          join the conversation.
        </p>

        <button
          className="
            mt-6 w-full flex items-center justify-center gap-2
            border border-gray-300 dark:border-gray-600
            py-3 rounded-full
            font-medium
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition
          "
        >
          <i className="fa-brands fa-instagram text-lg"></i>
          Continue with Instagram
        </button>

        <a href="/thread-clone/login" className="mt-4 text-xs text-gray-400 cursor-pointer hover:underline">
          Log in with username instead
        </a>
      </div>
    </div>
  );
}
