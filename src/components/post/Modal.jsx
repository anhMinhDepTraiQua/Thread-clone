// src/components/Modal.jsx
// State-based Modal - No layout shift version

import React, { useEffect, useRef } from 'react';

export default function Modal({
  isOpen = false,
  onClose,
  children,
  size = 'lg',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = false, // ← Changed to false by default
  className = '',
  overlayClassName = '',
  contentClassName = ''
}) {
  
  // Track mousedown position to prevent accidental close
  const mouseDownTargetRef = useRef(null);
  
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);
  
  // Prevent body scroll WITHOUT layout shift
  useEffect(() => {
    if (!isOpen) return;
    
    // Get current scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Store original values
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Prevent scroll and compensate for scrollbar width
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    return () => {
      // Restore original values
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);
  
  // Handle mousedown on backdrop - record where user started clicking
  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      mouseDownTargetRef.current = e.target;
    } else {
      mouseDownTargetRef.current = null;
    }
  };
  
  // Handle mouseup on backdrop - only close if mousedown also happened on backdrop
  const handleBackdropMouseUp = (e) => {
    if (
      closeOnClickOutside && 
      e.target === e.currentTarget && 
      mouseDownTargetRef.current === e.currentTarget
    ) {
      onClose?.();
    }
    // Reset after mouseup
    mouseDownTargetRef.current = null;
  };
  
  if (!isOpen) return null;
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn ${overlayClassName}`}
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
    >
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-[#1c1e21] rounded-2xl shadow-2xl transform transition-all animate-scaleIn max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* Close button - only show if explicitly enabled */}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 bg-white/80 backdrop-blur-sm"
            aria-label="Close modal"
          >
            <svg 
              className="w-5 h-5 text-gray-700" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
        
        {/* Modal content */}
        <div className={contentClassName}>
          {children}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}