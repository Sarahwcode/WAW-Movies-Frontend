import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import API from '../api'; 
export default function Profile() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // 1. ALL Hooks must be at the top
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

   API.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // res.data should contain { id, name, email, image ... }
      setUser(res.data);
    })
    .catch(err => {
      console.error("Profile fetch failed:", err);
      setError("Failed to load profile.");
    });
  }, []);

  // 2. Event handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);
    const token = localStorage.getItem("token");

    const updateData = {
      update_name: user.name,
      update_email: user.email
    };

    try {
      const res = await API.post('/api/auth/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Assuming backend returns an array of messages
      setMessages(res.data.messages || ["Profile updated!"]);
    } catch (error) {
      setMessages([error.response?.data?.message || "Something went wrong."]);
    }
  };

  // 3. Conditional returns ONLY after all hooks
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="update-profile">
      <img
        src={
          imagePreview ||
          (user.image ? `/uploaded_img/${user.image}` : "/images/default-avatar.png")
        }
        alt="Profile"
        style={{ width: 150, height: 150, borderRadius: "50%" }}
      />

      {messages.map((msg, i) => (
        <div className="message" key={i}>{msg}</div>
      ))}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex">
          <div className="inputBox">
            <span>Username :</span>
            <input
              type="text"
              className="box"
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              name="update_name"
            />

            <span>Your email :</span>
            <input
              type="email"
              className="box"
              value={user.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              name="update_email"
            />

            <span>Update your pic :</span>
            <input
              type="file"
              className="box"
              name="update_image"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />
          </div>

          <div className="inputBox">
            <span>Old password :</span>
            <input type="password" Name="update_pass" className="box" />
            <span>New password :</span>
            <input type="password" Name="new_pass" className="box" />
            <span>Confirm password :</span>
            <input type="password" Name="confirm_pass" className="box" />
          </div>
        </div>
        <button type="submit" className="btn">Update Profile</button>
      </form>
    </div>
  );
}