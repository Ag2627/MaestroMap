import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const SpinnerIcon = () => (
  <svg className="animate-spin h-12 w-12 text-orange-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const SuccessIcon = () => (
  <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


function VerifyEmail() {
  const [status, setStatus] = useState("verifying"); 
  const [message, setMessage] = useState("Verifying your email, please wait...");
  
  const location = useLocation();
  const navigate = useNavigate();
  const effectRan = useRef(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (effectRan.current === true) {
      return;
    }

    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      fetch(`${apiBaseUrl}/auth/verify-email?token=${token}`)
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message) });
          }
          return res.json();
        })
        .then(data => {
          setStatus("success");
          setMessage(data.message);
          
          setTimeout(() => {
            navigate("/signin");
          }, 2000); 
        })
        .catch((error) => {
          setStatus("error");
          setMessage(error.message || "An error occurred. Please try again later.");
        });
    } else {
      setStatus("error");
      setMessage("Invalid verification link. No token was provided.");
    }

    return () => {
      effectRan.current = true;
    };
  }, [location, navigate, apiBaseUrl]);

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <>
           
            <div className="flex justify-center">
              <SuccessIcon />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Email Verified Successfully!</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500 animate-pulse">
              Redirecting to the sign-in page...
            </p>
          </>
        );
      case "error":
        return (
          <>
            <div className="flex justify-center">
              <ErrorIcon />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="mt-2 text-red-600">{message}</p>
            <Link 
              to="/signup" 
              className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Go to Sign Up
            </Link>
          </>
        );
      default: 
        return (
          <>
            <div className="flex justify-center">
              <SpinnerIcon />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 animate-pulse">{message}</h2>
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-xl space-y-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default VerifyEmail;