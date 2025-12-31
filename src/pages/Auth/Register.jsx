export default function Register() {
  return (
    <div>
      <div className="absolute inset-0"></div>

      {/* Login box */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <h2 className="text-center text-sm font-bold text-black mb-6">
          Create an account to get started
        </h2>

        <form className="space-y-3">
          <input
            type="text"
            placeholder="Display name"
            className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />

          <input
            type="text"
            placeholder="Email"
            className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />

          <input
            type="Password"
            placeholder="Password"
            className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="Password"
            placeholder="Confirm Password"
            className="w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-black text-white font-medium text-sm hover:bg-black/90 transition"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-gray-500 hover:underline">
            <a href="/thread-clone/login"> Already have an account? Log in</a>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-xs text-gray-400">
        © 2025 Threads · Terms · Privacy Policy · Cookies Policy · Report a
        problem
      </div>
    </div>
  );
}
