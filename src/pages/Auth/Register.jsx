import { useState, useEffect } from 'react';
import { httpRequest } from '@/utils/httpRequest';

export default function Register() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced validation for display name
  useEffect(() => {
    if (!formData.displayName) return;
    
    const timer = setTimeout(() => {
      validateDisplayName(formData.displayName);
    }, 700);
    
    return () => clearTimeout(timer);
  }, [formData.displayName]);

  // Debounced validation for email
  useEffect(() => {
    if (!formData.email) return;
    
    const timer = setTimeout(() => {
      validateEmail(formData.email);
    }, 700);
    
    return () => clearTimeout(timer);
  }, [formData.email]);

  const validateDisplayName = (name) => {
    if (name.length < 3) {
      setErrors(prev => ({ ...prev, displayName: 'Tên hiển thị phải có ít nhất 3 ký tự' }));
    } else if (name.length > 50) {
      setErrors(prev => ({ ...prev, displayName: 'Tên hiển thị không được quá 50 ký tự' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.displayName;
        return newErrors;
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email không hợp lệ' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage('');
    
    // Validate all fields
    const newErrors = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Vui lòng nhập tên hiển thị';
    } else if (formData.displayName.length < 3) {
      newErrors.displayName = 'Tên hiển thị phải có ít nhất 3 ký tự';
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = 'Tên hiển thị không được quá 50 ký tự';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Call API
    setIsSubmitting(true);
    
    try {
      await httpRequest.post('/api/auth/register', {
        username: formData.displayName.trim(),  // API expects 'username' not 'display_name'
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });
      
      // Success
      setSuccessMessage('Chúng tôi đã gửi một liên kết xác thực tới email của bạn. Vui lòng kiểm tra email để xác thực tài khoản.');
      setFormData({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      
    } catch (error) {
      console.error('=== Registration error ===');
      console.error('Error:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      
      // Handle axios error with response data
      if (error?.response?.data) {
        const serverData = error.response.data;
        
        // Handle validation errors from server
        if (serverData.errors) {
          const serverErrors = {};
          
          // Map server error keys to form field names
          Object.keys(serverData.errors).forEach(key => {
            const errorMessages = serverData.errors[key];
            const errorMessage = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
            
            if (key === 'username' || key === 'display_name') {
              serverErrors.displayName = errorMessage;
            } else if (key === 'email') {
              serverErrors.email = errorMessage;
            } else if (key === 'password') {
              serverErrors.password = errorMessage;
            } else if (key === 'password_confirmation') {
              serverErrors.confirmPassword = errorMessage;
            } else {
              if (!serverErrors.general) {
                serverErrors.general = errorMessage;
              }
            }
          });
          
          setErrors(serverErrors);
        } else if (serverData.message) {
          setErrors({ general: serverData.message });
        } else {
          setErrors({ general: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
        }
      } else if (typeof error === 'string') {
        // Simple string error message
        setErrors({ general: error });
      } else {
        // Unknown error format
        setErrors({ general: error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm px-4 mx-auto">
      <h2 className="text-center text-sm font-bold text-black mb-6">
        Create an account to get started
      </h2>

      <div className="space-y-3">
        {/* Display Name Field */}
        <div className="min-h-[68px]">
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Display name"
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 transition-all ${
              errors.displayName ? 'ring-2 ring-red-300 bg-red-50' : 'focus:ring-black/20'
            }`}
            disabled={isSubmitting}
          />
          <div className="h-5 mt-1">
            {errors.displayName && (
              <p className="text-red-500 text-xs ml-1">{errors.displayName}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="min-h-[68px]">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 transition-all ${
              errors.email ? 'ring-2 ring-red-300 bg-red-50' : 'focus:ring-black/20'
            }`}
            disabled={isSubmitting}
          />
          <div className="h-5 mt-1">
            {errors.email && (
              <p className="text-red-500 text-xs ml-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="min-h-[68px]">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 transition-all ${
              errors.password ? 'ring-2 ring-red-300 bg-red-50' : 'focus:ring-black/20'
            }`}
            disabled={isSubmitting}
          />
          <div className="h-5 mt-1">
            {errors.password && (
              <p className="text-red-500 text-xs ml-1">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="min-h-[68px]">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 transition-all ${
              errors.confirmPassword ? 'ring-2 ring-red-300 bg-red-50' : 'focus:ring-black/20'
            }`}
            disabled={isSubmitting}
          />
          <div className="h-5 mt-1">
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs ml-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-black text-white font-medium text-sm hover:bg-black/90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Đang đăng ký...' : 'Register'}
        </button>
      </div>

      {/* Messages moved here - below the button */}
      {(successMessage || errors.general) && (
        <div className="mt-4">
          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm leading-relaxed">
              {successMessage}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm leading-relaxed">
              {errors.general}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <a href="/thread-clone/login" className="text-sm text-gray-500 hover:underline">
          Already have an account? Log in
        </a>
      </div>
    </div>
  );
}