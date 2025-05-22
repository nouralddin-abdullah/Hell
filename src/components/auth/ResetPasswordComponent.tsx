import React, { useState } from "react";
import Input from "../common/input/Input";
import Button from "../common/button/Button";
import { useParams } from "react-router-dom";
import { useResetPassword } from "../../hooks/auth/useResetPassword";

const ResetPasswordFormComponent = () => {
  const { resetToken } = useParams();
  const { mutateAsync, isPending } = useResetPassword(resetToken || "");

  const [formFields, setFormFields] = useState<{
    newPassword: string;
    confirmNewPassword: string;
  }>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormFields((prevState) => ({ ...prevState, [field]: value }));

    // Real-time validation for confirm password field
    if (field === "confirmNewPassword") {
      validateConfirmPassword(value, formFields.newPassword);
    } else if (field === "newPassword") {
      // Re-validate confirm password when new password changes
      if (formFields.confirmNewPassword) {
        validateConfirmPassword(formFields.confirmNewPassword, value);
      }
      validateNewPassword(value);
    }
  };

  const [fieldsErrors, setFieldsErrors] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleErrorsChange = (field: string, msg: string) => {
    setFieldsErrors((prevState) => ({ ...prevState, [field]: msg }));
  };

  const validateNewPassword = (password: string) => {
    if (!password.trim()) {
      handleErrorsChange("newPassword", "Password is required");
      return false;
    } else if (password.length < 6) {
      handleErrorsChange(
        "newPassword",
        "Password must be at least 6 characters long"
      );
      return false;
    } else {
      handleErrorsChange("newPassword", "");
      return true;
    }
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    newPassword: string
  ) => {
    if (!confirmPassword.trim()) {
      handleErrorsChange("confirmNewPassword", "Please confirm your password");
      return false;
    } else if (confirmPassword !== newPassword) {
      handleErrorsChange("confirmNewPassword", "Passwords do not match");
      return false;
    } else {
      handleErrorsChange("confirmNewPassword", "");
      return true;
    }
  };

  const validateFields = () => {
    let isValid = true;

    // Validate new password
    if (!validateNewPassword(formFields.newPassword)) {
      isValid = false;
    }

    // Validate confirm password
    if (
      !validateConfirmPassword(
        formFields.confirmNewPassword,
        formFields.newPassword
      )
    ) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields() === false) return;

    const formData = new FormData();
    formData.append("password", formFields.newPassword.trim());
    formData.append("passwordConfirm", formFields.confirmNewPassword.trim());

    await mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Input
            type="password"
            value={formFields.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            labelText="New Password"
          />

          {fieldsErrors.newPassword && (
            <p style={{ fontSize: "12px" }} className="error-msg">
              {fieldsErrors.newPassword}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Input
            type="password"
            value={formFields.confirmNewPassword}
            onChange={(e) =>
              handleInputChange("confirmNewPassword", e.target.value)
            }
            labelText="Confirm New Password"
          />

          {fieldsErrors.confirmNewPassword && (
            <p style={{ fontSize: "12px" }} className="error-msg">
              {fieldsErrors.confirmNewPassword}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        style={{ margin: "2rem auto 0" }}
        isLoading={isPending}
      >
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPasswordFormComponent;
