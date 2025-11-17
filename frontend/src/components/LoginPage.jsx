import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
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
      {/* MAIN CONTAINEr*/}
      <div className="flex items-center justify-center min-h-screen bg-sky-50 p-6">
        
        {/* LOGIN CARD CONTAINER*/}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col-reverse md:flex-row-reverse overflow-hidden">
          
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-2 text-center">
              TaskFlow
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Sign in to continue managing your tasks
            </p>

            {/* Placeholder Email + Password */}
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 outline-none transition duration-150"
                disabled
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 outline-none transition duration-150"
                disabled
              />
              <button
                type="button"
                disabled
                className="w-full bg-purple-500 text-white font-bold text-lg py-3 rounded-xl opacity-60 cursor-not-allowed shadow-md hover:shadow-lg transition duration-150"
              >
                Login
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 font-medium text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log("Login Failed")}
                shape="pill"
                theme="outline"
                text="signin_with"
                size="large"
              />
            </div>
          </div>
          
          {/* LEFT IMAGE SIDE CONTAINER*/}
          <div className="w-full md:w-1/2 p-4 flex justify-center items-center mb-8 md:mb-0">
            <img
              src={login_illustration} 
              alt="Task Manager Illustration"
              className="w-full max-w-[90%] h-auto object-contain drop-shadow-lg"
            />
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
