import { useState } from 'react';
import Modal from '@/components/post/Modal'; 
import CreatePost from '@/components/post/CreatePost';
function whatAreYouThinking() {
 const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  return (
    <div className="px-[24px] py-[16px] bg-white dark:bg-[#1c1e21] border border-gray-200 dark:border-neutral-700 rounded-tl-[20px] rounded-br-[0] rounded-tr-[20px] rounded-bl-[0]">
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full inline-block">
            <button >
            <img src="" alt="" className="w-10 h-10 rounded-full object-cover" />
            </button>
          </div>
          <button  type="button" onClick={() => setIsCreatePostOpen(true)} className='outline-none select-none'>
          <span className="ml-2 text-gray-500 dark:text-gray-400 w-[300px] cursor-text">What are you thinking?</span>
          </button>
        </div>
          <Modal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        size="lg"
      >
        <CreatePost />
      </Modal>
        <button className="border border-neutral-700 cursor-pointer text-white px-4 py-1 rounded-[10px] text-sm">Post</button>
      </div>
    </div>
  );
}
export default whatAreYouThinking;
