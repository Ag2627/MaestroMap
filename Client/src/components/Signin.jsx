// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; 
// import { Link } from 'react-router-dom';
// const Signin = () => {
// const [formData, setFormData] = useState({ email: '', password: '' });
// const [message, setMessage] = useState('');
// const navigate = useNavigate();
// const { login } = useAuth(); 

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   }; 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     try {
//       const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${apiBaseUrl}/auth/signin`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         login(data);
//         window.location.href = '/';
//       } else {
//         setMessage(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       setMessage('An unexpected error occurred. Please try again.');
//     }
//   };
  

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//       <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold text-center">Sign In to Your Account</h2>
//         <form className="space-y-6" onSubmit={handleSubmit}>
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
//               autoComplete="current-password"
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
//               Sign In
//             </button>
//           </div>
//         </form>
//         {/* Display success or error messages */}
//         {message && <p className="text-center text-sm text-red-400 mt-4">{message}</p>}
        
//         {/* 5. ADD LINK TO SIGNUP */}
//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-400">
//             Don't have an account?{' '}
//             <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-500">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import bg from '../assets/background.png';

// const Signin = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     try {
//       const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${apiBaseUrl}/auth/signin`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         login(data);
//         window.location.href = '/';
//       } else {
//         setMessage(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       setMessage('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div 
//       className="flex items-center justify-center min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: `url(${bg})` }} // <-- Replace with correct path
//     >
//       <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-lg backdrop-blur-sm">
//         <h2 className="text-3xl font-bold text-center text-white">Sign In to Your Account</h2>
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           {/* Email Input */}
//           <div>
//             <label htmlFor="email" className="text-sm font-medium text-gray-200">
//               Email address
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               className="w-full px-3 py-2 mt-1 text-white bg-gray-800/80 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               onChange={handleChange}
//               value={formData.email}
//             />
//           </div>
//           {/* Password Input */}
//           <div>
//             <label htmlFor="password" className="text-sm font-medium text-gray-200">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="current-password"
//               required
//               className="w-full px-3 py-2 mt-1 text-white bg-gray-800/80 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               onChange={handleChange}
//               value={formData.password}
//             />
//           </div>
//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               className="w-full px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Sign In
//             </button>
//           </div>
//         </form>
//         {/* Display success or error messages */}
//         {message && <p className="text-center text-sm text-red-400 mt-4">{message}</p>}
        
//         {/* Signup Link */}
//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-300">
//             Don't have an account?{' '}
//             <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-500">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import bg from '../assets/background.png'; // ✅ import your image

// const Signin = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     try {
//       const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${apiBaseUrl}/auth/signin`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         login(data);
//         window.location.href = '/';
//       } else {
//         setMessage(`Error: ${data.message}`);
//       }
//     } catch (error) {
//       setMessage('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left side with background image */}
//       <div
//         className="hidden md:flex w-1/2 bg-cover bg-center"
//         style={{ backgroundImage: `url(${bg})` }}
//       >
//         {/* Overlay with text */}
//         <div className="flex items-center justify-center w-full bg-black/50">
//           <h1 className="text-4xl font-bold text-white text-center px-8">
//             Welcome Back!  
//             <span className="block text-indigo-400 mt-2">Sign in to continue</span>
//           </h1>
//         </div>
//       </div>

//       {/* Right side with form */}
//       <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-900 text-white">
//         <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/90 rounded-lg shadow-lg">
//           <h2 className="text-3xl font-bold text-center">Sign In</h2>

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {/* Email Input */}
//             <div>
//               <label htmlFor="email" className="text-sm font-medium text-gray-300">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
//                 onChange={handleChange}
//                 value={formData.email}
//               />
//             </div>

//             {/* Password Input */}
//             <div>
//               <label htmlFor="password" className="text-sm font-medium text-gray-300">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
//                 onChange={handleChange}
//                 value={formData.password}
//               />
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 className="w-full px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 Sign In
//               </button>
//             </div>
//           </form>

//           {/* Error / Success messages */}
//           {message && <p className="text-center text-sm text-red-400 mt-4">{message}</p>}

//           {/* Signup link */}
//           <div className="text-center mt-4">
//             <p className="text-sm text-gray-300">
//               Don&apos;t have an account?{' '}
//               <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-500">
//                 Sign Up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bg from '../assets/background.png'; // Left side image

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        login(data);
        window.location.href = '/';
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with background image */}
      <div
  className="hidden md:flex w-1/2 bg-cover bg-center relative"
  style={{ backgroundImage: `url(${bg})` }}
>
  {/* Soft dark overlay so text is readable but image is visible */}
  <div className="absolute inset-0 bg-black/30"></div>

  {/* Text content */}
  <div className="relative flex items-center justify-center w-full px-8">
    <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
      Welcome Back!
      <span className="block text-orange-400 mt-2">Sign in to continue</span>
    </h1>
  </div>
</div>
      

      {/* Right side with gradient theme */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/80 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center text-gray-900">Sign In</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 sm:text-sm"
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
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 sm:text-sm"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-md shadow hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Error / Success messages */}
          {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}

          {/* Signup link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-700">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-orange-500 hover:text-red-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

