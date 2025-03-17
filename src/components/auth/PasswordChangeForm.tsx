import React, { useState, useEffect } from "react";
import Button from "../common/button/Button";
import Input from "../common/input/Input";
import { useUpdateUserPassword } from "../../hooks/users/useChangeUserPassword";

const PasswordChangeForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { mutateAsync: updateUserData, isPending } = useUpdateUserPassword();

  // Validate old password as user types
  useEffect(() => {
    if (oldPassword.length > 0 && oldPassword.length < 8) {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "Password must be at least 8 characters long",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "",
      }));
    }
  }, [oldPassword]);

  // Validate new password as user types
  useEffect(() => {
    if (newPassword.length > 0 && newPassword.length < 8) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 8 characters long",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        newPassword: "",
      }));
    }
  }, [newPassword]);

  // Validate confirm password as user types
  useEffect(() => {
    if (confirmPassword.length > 0 && confirmPassword !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  }, [confirmPassword, newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submission
    if (oldPassword.length < 8) {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "Password must be at least 8 characters long",
      }));
      return;
    }

    if (newPassword.length < 8) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 8 characters long",
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    // Create FormData and submit
    const formData = new FormData();
    formData.append("passwordCurrent", oldPassword);
    formData.append("password", newPassword);
    formData.append("passwordConfirm", confirmPassword);

    await updateUserData(formData);

    // Clear form after successful submission
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const errorMessageStyle = {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    color: "#dc2626",
  };

  return (
    <div style={{ marginBottom: "5rem" }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <Input
            labelText="Current Password"
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          {errors.oldPassword && (
            <p style={errorMessageStyle}>{errors.oldPassword}</p>
          )}
        </div>

        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <Input
            labelText="New Password"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && (
            <p style={errorMessageStyle}>{errors.newPassword}</p>
          )}
        </div>

        <div
          style={{
            marginBottom: "1.5rem",
          }}
        >
          <Input
            labelText="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p style={errorMessageStyle}>{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" isLoading={isPending}>
          Update Password
        </Button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
