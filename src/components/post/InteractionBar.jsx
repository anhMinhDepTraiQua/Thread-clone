import { useState } from "react"
import { Heart, MessageCircle, Repeat, Send, Image, Sticker, Smile, List, MapPin, MoreHorizontal, Play, X } from "lucide-react"
import ReplyModal from "./ReplyModal"
// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// InteractionBar Component
export default function InteractionBar({ stats = {}, isLiked = false, postId, onLike }) {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked)
  const [localLikes, setLocalLikes] = useState(stats.likes ?? 0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)

  const handleLikeClick = async () => {
    const previousIsLiked = localIsLiked
    const previousLikes = localLikes

    try {
      const newIsLiked = !localIsLiked
      setLocalIsLiked(newIsLiked)
      setLocalLikes((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)))

      if (newIsLiked) {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)
      }

      if (onLike) {
        await onLike(postId, newIsLiked)
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error)
      setLocalIsLiked(previousIsLiked)
      setLocalLikes(previousLikes)
      alert("Failed to update like. Please try again.")
    }
  }

  const handleCommentClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Comment button clicked!") // Debug log
    setIsReplyModalOpen(true)
  }

  const handleCloseModal = () => {
    console.log("Closing modal") // Debug log
    setIsReplyModalOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-2 transition-colors ${
              localIsLiked ? "text-pink-600 hover:text-pink-700" : "hover:text-pink-600"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                localIsLiked ? "fill-current" : ""
              } ${isAnimating ? "scale-125" : "scale-100"}`}
            />
            <span className={localIsLiked ? "font-medium" : ""}>{localLikes}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            onClick={handleCommentClick}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{stats.comments ?? 0}</span>
          </button>

          {/* Repost Button */}
          <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
            <Repeat className="w-5 h-5" />
            <span>{stats.reposts ?? 0}</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center gap-2 hover:text-gray-700 transition-colors">
            <Send className="w-5 h-5" />
            <span>{stats.shares ?? 0}</span>
          </button>
        </div>
      </div>
                        {/* Modal - Render outside to avoid z-index issues */}
      <Modal isOpen={isReplyModalOpen} onClose={handleCloseModal}>
        <ReplyModal postId={postId} onClose={handleCloseModal} />
      </Modal>

    </>
  )
}