import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import API from '../api'; 

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New: state to toggle view/edit
  const [messages, setMessages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Fetch profile data
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
      setUser(res.data);
    })
    .catch(err => {
      console.error("Profile fetch failed:", err);
      setError("Failed to load profile.");
    });
  }, []);

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

    // Creating FormData to handle image file uploads
    const formData = new FormData(e.currentTarget);

    try {
      // Changed to .put or .post as .get cannot send a body for updates
      const res = await API.put('/api/auth/profile', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessages(["Profile updated!"]);
      setIsEditing(false); // Return to view mode after success
    } catch (error) {
      setMessages([error.response?.data?.message || "Something went wrong."]);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="update-profile">
      {/* 1. Profile Picture (Always visible) */}
      <img
        src={
          imagePreview ||
          (user.image ? `/uploaded_img/${user.image}` : "/images/default-avatar.png")
        }
        alt="Profile"
        className="profile-img"
      />

      {/* 2. Toggle between VIEW mode and EDIT mode */}
      {!isEditing ? (
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="username-display">@{user.username || 'username'}</p>
          <p>{user.email}</p>
          <div className="interests-section">
      <h3>My Interests</h3>
      <div className="interest-tags">
        {user.interests ? (
          /* Splitting the string by comma and trimming whitespace */
          user.interests.split(',').map((item, index) => (
            <span key={index} className="tag">{item.trim()}</span>
          ))
        ) : (
          <p>No interests added. Click Update Profile to add some!</p>
        )}
      </div>
    </div>
          <button className="btn" onClick={() => setIsEditing(true)}>
            Update Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {messages.map((msg, i) => (
            <div className="message" key={i}>{msg}</div>
          ))}
          
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
              <input type="password" name="update_pass" className="box" />
              <span>New password :</span>
              <input type="password" name="new_pass" className="box" />
              <span>Confirm password :</span>
              <input type="password" name="confirm_pass" className="box" />
            </div>
          </div>
          
          <div className="button-group">
            <button type="submit" className="btn">Save Changes</button>
            <button type="button" className="delete-btn" onClick={() => setIsEditing(false)}>
                Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}