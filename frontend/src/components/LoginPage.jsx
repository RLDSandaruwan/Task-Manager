import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { HiViewGrid } from "react-icons/hi";
import login_illustration from "../assets/login-illustration.png";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function LoginPage({ onLogin }) {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Debug log
      console.log("API URL:", SERVER_URL);
      
      if (!SERVER_URL) {
        alert("ERROR: Backend API URL is not configured. Please set REACT_APP_SERVER_URL environment variable.");
        console.error("REACT_APP_SERVER_URL is undefined");
        return;
      }

      const res = await fetch(`${SERVER_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers.get('content-type'));
      
      // Check if response is actually JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        alert("Backend error: Server returned non-JSON response. Check console for details.");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        console.error("Backend Error:", data.msg);
        alert("Login failed: " + (data.msg || "Unknown error"));
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("Cannot connect to backend server. Please check if the backend is running.");
    }
  };
return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {/* Main Container with Gradient Background */}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-todoist-bg via-orange-50 to-red-50 p-4 sm:p-6 lg:p-8">
        
        {/* Login Card with Modern Shadow and Hover Effect */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Side - Login Form */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              
              {/* TaskFlow Logo with Icon */}
              <div className="flex items-center justify-center gap-3 mb-8 animate-fadeIn">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-todoist-red to-orange-600 flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                  <HiViewGrid className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-todoist-red to-orange-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
              </div>
              
              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-todoist-text mb-2">
                  Welcome
                </h2>
                <p className="text-sm sm:text-base text-todoist-textLight">
                  Sign in to organize your tasks efficiently
                </p>
              </div>

              {/* Email + Password Form (Disabled for now) */}
              <form className="space-y-4 mb-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-todoist-red focus:ring-2 focus:ring-red-100 transition-all text-sm sm:text-base"
                    disabled
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-todoist-red focus:ring-2 focus:ring-red-100 transition-all text-sm sm:text-base"
                    disabled
                  />
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full bg-gray-200 text-gray-400 font-semibold py-3 rounded-lg cursor-not-allowed transition-all text-sm sm:text-base"
                >
                  Continue with Email
                </button>
              </form>

              {/* Divider with OR */}
              <div className="flex items-center mb-6">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-4 text-sm text-todoist-textLight font-medium">OR</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              {/* Google Login Button with Hover Animation */}
              <div className="flex justify-center mb-6">
                <div className="transform transition-all duration-300 hover:scale-105">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log("Login Failed")}
                    shape="rectangular"
                    theme="outline"
                    text="continue_with"
                    size="large"
                    width="300"
                  />
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center text-xs text-todoist-textLight px-4">
                By continuing, you agree to TaskFlow's Terms of Service and Privacy Policy
              </p>
            </div>
            
            {/* Right Side - Illustration */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center">
              <div className="animate-float">
                <img
                  src={login_illustration} 
                  alt="Task Manager Illustration"
                  className="w-full max-w-sm lg:max-w-md h-auto object-contain drop-shadow-2xl"
                />
              </div>
              <div className="mt-8 text-center px-4">
                <h3 className="text-lg sm:text-xl font-bold text-todoist-text mb-2">
                  Organize your work and life
                </h3>
                <p className="text-sm sm:text-base text-todoist-textLight">
                  Stay focused and productive with TaskFlow
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
