import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user data when page loads
  useEffect(() => {
    axios.get("http://localhost:3001/api/profile")
      .then(res => {
        setUser(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!user) return <div>Loading...</div>;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);

    const formData = new FormData();
    formData.append("update_name", user.name);
    formData.append("update_email", user.email);
    formData.append("update_pass", e.target.update_pass.value);
    formData.append("new_pass", e.target.new_pass.value);
    formData.append("confirm_pass", e.target.confirm_pass.value);

    if (e.target.update_image.files[0]) {
      formData.append("update_image", e.target.update_image.files[0]);
    }

    try {
      const res = await axios.post("http://localhost:3001/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessages(res.data.messages);
    } catch {
      setMessages(["Something went wrong."]);
    }
  };

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
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              name="update_name"
            />

            <span>Your email :</span>
            <input
              type="email"
              className="box"
              value={user.email}
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
            <input type="password" className="box" name="update_pass" />

            <span>New password :</span>
            <input type="password" className="box" name="new_pass" />

            <span>Confirm password :</span>
            <input type="password" className="box" name="confirm_pass" />
          </div>

        </div>

        <button type="submit" className="btn">Update Profile</button>
      </form>

    </div>
  );
}