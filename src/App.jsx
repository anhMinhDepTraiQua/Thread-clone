import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";
import ToastContainer from "./components/Toast";
export default function App() {
  return (
    <BrowserRouter basename="/Thread-clone">
      <AppContent />
      {/* Toast Container - đặt ở đây để hiển thị trên toàn app */}
      <ToastContainer />

    </BrowserRouter>
  );
}
