import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function LoginPage({ onLogin }) {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // ✅ Send Google token to backend for verification & user save
      const res = await fetch(`${SERVER_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Backend verified user:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        console.error("❌ Backend Error:", data.msg);
      }
    } catch (err) {
      console.error("❌ Error during login:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-white">
        <h1 className="text-3xl font-bold text-purpleMain mb-8">Task Manager</h1>
        <p className="mb-6 text-gray-600">Sign in with your Google account to continue</p>

        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("Login Failed")}
          shape="pill"
          theme="filled_blue"
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
