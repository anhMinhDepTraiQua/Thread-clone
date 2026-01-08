"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/post/Modal"
import CreatePost from "@/components/post/CreatePost"
import axiosClient from "@/utils/httpRequest"
import { NavLink } from "react-router-dom"

function WhatAreYouThinking() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")

        if (!accessToken) {
          setUser(null)
          setLoading(false)
          return
        }

        const userData = await axiosClient.get("/api/auth/user")
        console.log("👤 User data:", userData)

        setUser(userData.data?.user || userData.user || userData.data || userData)
      } catch (err) {
        console.error("Error fetching user:", err)
        setUser(null)
        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("user")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="px-[24px] py-[16px] bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-neutral-700 rounded-tl-[20px] rounded-br-[0] rounded-tr-[20px] rounded-bl-[0]">
        <div className="flex justify-between">
          <div className="flex justify-center items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="ml-2 h-5 w-[200px] bg-gray-300 rounded animate-pulse" />
          </div>
          <button className="border border-neutral-700 text-white px-4 py-1 rounded-[10px] text-sm opacity-50 cursor-not-allowed">
            Post
          </button>
        </div>
      </div>
    )
  }

  if (!user && !loading) {
    return null
  }

  const userId = user?.id || user?._id || "default"
  const avatarUrl = user?.avatar_url || user?.avatar || `https://i.pravatar.cc/150?u=${userId}`

  return (
    <div className="px-[24px] py-[16px] bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-neutral-700 rounded-tl-[20px] rounded-br-[0] rounded-tr-[20px] rounded-bl-[0]">
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <NavLink to="/profile" className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={avatarUrl}
              alt={user?.name || user?.username || "User avatar"}
              className="w-full h-full object-cover"
            />
          </NavLink>
          <button 
            type="button" 
            onClick={() => setIsCreatePostOpen(true)} 
            className="outline-none select-none ml-2"
          >
            <span className="text-gray-500 dark:text-gray-400 w-[300px] cursor-text text-left inline-block">
              What are you thinking?
            </span>
          </button>
        </div>

        <Modal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} size="lg">
          <CreatePost user={user} onClose={() => setIsCreatePostOpen(false)} />
        </Modal>

        <button
          className="border border-neutral-700 cursor-pointer text-white px-4 py-1 rounded-[10px] text-sm hover:bg-neutral-800 transition-colors flex-shrink-0"
          onClick={() => setIsCreatePostOpen(true)}
        >
          Post
        </button>
      </div>
    </div>
  )
}

export default WhatAreYouThinking