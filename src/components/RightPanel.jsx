import React from "react";

export default function RightPanel() {
  return (
    <div className="space-y-4 sticky top-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold">Log in or sign up for Threads</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">See what people are talking about.</p>
        <div className="mt-4">
          <button className="w-full px-4 py-2 rounded-lg border">Continue with Instagram</button>
        </div>
      </div>
      {/* thêm trends, suggestions ở đây */}
    </div>
  );
}
