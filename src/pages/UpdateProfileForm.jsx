import React from "react";

const UpdateProfileForm = ({ user, setUser, handleImageChange, handleSubmit, messages }) => {
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {messages.map((msg, i) => (
        <div className="message" key={i}>{msg}</div>
      ))}

      <div className="flex">
        <div className="inputBox">
          <div>
          <div>Username :</div>
          <input
            type="text"
            className="box"
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            name="update_name"
          />
          </div>
           <div>
          <div>Your email :</div>
          <input
            type="email"
            className="box"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            name="update_email"
          />
          </div>

          <div>Update your pic :</div>
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
      
      <button type="submit" className="btn">Save Changes</button>
    </form>
  );
};

export default UpdateProfileForm;