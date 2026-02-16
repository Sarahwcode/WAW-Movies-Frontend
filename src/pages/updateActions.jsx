import React from "react";

const UpdateActions = ({ onSubmit }) => {
  return (
    <div className="inputBox">
      <span>Old password :</span>
      <input type="password" name="update_pass" className="box" />
      
      <span>New password :</span>
      <input type="password" name="new_pass" className="box" />
      
      <span>Confirm password :</span>
      <input type="password" name="confirm_pass" className="box" />
      
      <button type="submit" className="btn" style={{marginTop: '20px', width: '100%'}}>
        Update Profile
      </button>
    </div>
  );
};

export default UpdateActions;