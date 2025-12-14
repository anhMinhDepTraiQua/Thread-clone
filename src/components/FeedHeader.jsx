import React from "react";

export default function FeedHeader({ title }) {
  return (
    <div className="bg-[rgb(250,250,250)] dark:bg-[rgb(16,16,16)] rounded-xl p-4 shadow-sm sticky top-6 z-10">
      <h1 className="text-lg font-semibold text-center">{title}</h1>
    </div>
  );
}
