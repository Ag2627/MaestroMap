import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        setMessage('Registration successful! Redirecting to sign-in...');
        

        setTimeout(() => {
          navigate('/signin');
        }, 2000); 

      } else {
      
        console.error('Signup failed:', data.message);
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Create Your Account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullname" className="text-sm font-medium text-gray-400">
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              value={formData.fullname}
            />
          </div>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-400">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
            >
              Sign Up
            </button>
          </div>
        </form>
        {/* 6. Display success or error messages */}
        {message && <p className="text-center text-sm text-red-400 mt-4">{message}</p>}
        
        {/* 7. Add link to the sign-in page */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-indigo-400 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;