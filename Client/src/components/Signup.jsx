// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; 

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     fullname: '',
//     email: '',
//     password: '',
//   });
  
//   const [message, setMessage] = useState('');
  
//   const navigate = useNavigate(); 

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(''); 

//     try {
//       const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${apiBaseUrl}/auth/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Signup successful:', data);
//         setMessage('Registration successful! Redirecting to sign-in...');
        

//         setTimeout(() => {
//           navigate('/signin');
//         }, 2000); 

//       } else {
      
//         console.error('Signup failed:', data.message);
//         setMessage(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       console.error('Error during signup:', error);
//       setMessage('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//       <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold text-center">Create Your Account</h2>
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           {/* Full Name Input */}
//           <div>
//             <label htmlFor="fullname" className="text-sm font-medium text-gray-400">
//               Full Name
//             </label>
//             <input
//               id="fullname"
//               name="fullname"
//               type="text"
//               required
//               className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               onChange={handleChange}
//               value={formData.fullname}
//             />
//           </div>
//           {/* Email Input */}
//           <div>
//             <label htmlFor="email" className="text-sm font-medium text-gray-400">
//               Email address
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               onChange={handleChange}
//               value={formData.email}
//             />
//           </div>
//           {/* Password Input */}
//           <div>
//             <label htmlFor="password" className="text-sm font-medium text-gray-400">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="new-password"
//               required
//               className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               onChange={handleChange}
//               value={formData.password}
//             />
//           </div>
//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               className="w-full px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
//             >
//               Sign Up
//             </button>
//           </div>
//         </form>
//         {/* 6. Display success or error messages */}
//         {message && <p className="text-center text-sm text-red-400 mt-4">{message}</p>}
        
//         {/* 7. Add link to the sign-in page */}
//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-400">
//             Already have an account?{' '}
//             <Link to="/signin" className="font-medium text-indigo-400 hover:text-indigo-500">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bg from '../assets/background.png'; // Left side image

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  // New states for better UI feedback
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // To style message (green/red)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Immediate feedback when button is clicked
    setMessage('Sending verification email...');
    setIsLoading(true);
    setIsSuccess(false); // Reset success state

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        // 2. Update message on success
        setMessage('Verification email sent! Please check your inbox.');
        setIsSuccess(true);
        // Optional: Clear form on success
        setFormData({ fullname: '', email: '', password: '' });
      } else {
        console.error('Signup failed:', data.message);
        setMessage(`${data.message}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      // 3. Always turn off loading, success or fail
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with background image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex items-center justify-center w-full px-8">
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
            Join Us Today!
            <span className="block text-orange-400 mt-2">Create your account</span>
          </h1>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/80 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center text-gray-900">Sign Up</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullname" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                // Disable input while loading
                disabled={isLoading}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={handleChange}
                value={formData.fullname}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            {/* Submit Button updated for loading state */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-2 text-sm font-bold text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' // Styles when loading
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' // Normal styles
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    {/* Optional: Simple SVG spinner */}
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Error / Success messages with dynamic color */}
          {message && (
            <p className={`text-center text-sm mt-4 font-medium ${
              isSuccess || isLoading ? 'text-blue-600' : 'text-red-500'
            }`}>
              {message}
            </p>
          )}

          {/* Sign In link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-700">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-orange-500 hover:text-red-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;