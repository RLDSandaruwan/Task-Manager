
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  try {
    // Validate environment variable
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID environment variable is not set");
      return res.status(500).json({ msg: "Server configuration error: Missing GOOGLE_CLIENT_ID" });
    }

    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ msg: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        profilePic: picture,
      });
    }

    res.status(200).json({
      msg: "Google login success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ msg: "Authentication failed" });
  }
};
