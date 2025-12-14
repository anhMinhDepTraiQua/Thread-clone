// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "@/components/post/postsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    // other reducers...
  },
});

export default store;
