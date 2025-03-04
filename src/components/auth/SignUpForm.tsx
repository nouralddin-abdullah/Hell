import React, { useState } from "react";
import { SignUpForm } from "../../types/SignUpFields";
import Input from "../common/input/Input";
import { useSignUp } from "../../hooks/auth/useSignUp";
import ChipButton from "../common/button/ChipButton";
import Button from "../common/button/Button";
import ImageCropper from "../common/image cropper/ImageCropper";
import { anonymousUser } from "../../assets";

const SignUpFormComponent = () => {
  const { mutateAsync, isPending } = useSignUp();

  const [formFields, setFormFields] = useState<SignUpForm>({
    fullName: "",
    username: "",
    email: "",
    group: "",
    password: "",
    passwordConfirm: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormFields((prevState) => ({ ...prevState, [field]: value }));
  };

  const [fieldsErrors, setFieldsErrors] = useState({
    fullName: "",
    username: "",
    email: "",
    group: "",
    password: "",
    passwordConfirm: "",
  });

  const handleErrorsChange = (field: string, msg: string) => {
    setFieldsErrors((prevState) => ({ ...prevState, [field]: msg }));
  };

  const validateFields = () => {
    let isValid = true;

    // Full Name validation
    if (formFields.fullName.trim().length < 3) {
      handleErrorsChange(
        "fullName",
        "Full Name must have at least 3 characters"
      );
      isValid = false;
    } else {
      handleErrorsChange("fullName", "");
    }

    // Username validation
    if (formFields.username.trim().length < 3) {
      handleErrorsChange(
        "username",
        "Username must have at least 3 characters"
      );
      isValid = false;
    } else {
      handleErrorsChange("username", "");
    }

    // Username validation: only letters, numbers, and hyphens allowed (no spaces)
    if (!/^[a-zA-Z0-9-]+$/.test(formFields.username)) {
      handleErrorsChange(
        "username",
        "Username can only contain letters, numbers, and hyphens (-), no spaces."
      );
      isValid = false;
    } else {
      handleErrorsChange("username", "");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formFields.email.trim())) {
      handleErrorsChange("email", "Please enter a valid email address");
      isValid = false;
    } else {
      handleErrorsChange("email", "");
    }

    // Group validation
    if (formFields.group === "") {
      handleErrorsChange("group", "Please select a group");
      isValid = false;
    } else {
      handleErrorsChange("group", "");
    }

    // Password validation
    if (formFields.password.length < 8) {
      handleErrorsChange(
        "password",
        "Password must have at least 8 characters"
      );
      isValid = false;
    } else {
      handleErrorsChange("password", "");
    }

    // Confirm Password validation
    if (formFields.passwordConfirm !== formFields.password) {
      handleErrorsChange("passwordConfirm ", "Passwords do not match");
      isValid = false;
    } else {
      handleErrorsChange("passwordConfirm ", "");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields() === false) return;

    const formData = new FormData();

    formData.append("fullName", formFields.fullName.trim());
    formData.append("username", formFields.username.trim());
    formData.append("email", formFields.email.trim());
    formData.append("password", formFields.password.trim());
    formData.append("passwordConfirm", formFields.passwordConfirm.trim());
    formData.append("group", formFields.group);
    if (formFields.photo) formData.append("photo", formFields.photo);

    await mutateAsync(formData);
  };

  const handleImageChange = (imgAttr: string, file: File) => {
    setFormFields((prevState) => ({
      ...prevState,
      [imgAttr]: file,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="sign-up-form">
      <ImageCropper
        imgAttr="photo"
        submitFunction={handleImageChange}
        defaultImgSrc={anonymousUser}
        imgState={formFields.photo}
        imgStyle="signup-profile-pic"
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          value={formFields.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          labelText="Full Name"
        />
        {fieldsErrors.fullName && (
          <p style={{ fontSize: "12px" }} className="error-msg">
            {fieldsErrors.fullName}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          value={formFields.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          labelText="Username"
        />
        {fieldsErrors.username && (
          <p style={{ fontSize: "12px" }} className="error-msg">
            {fieldsErrors.username}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          value={formFields.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          labelText="Email"
        />
        {fieldsErrors.email && (
          <p style={{ fontSize: "12px" }} className="error-msg">
            {fieldsErrors.email}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          value={formFields.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          labelText="Password"
          type="password"
        />
        {fieldsErrors.password && (
          <p style={{ fontSize: "12px" }} className="error-msg">
            {fieldsErrors.password}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          value={formFields.passwordConfirm}
          onChange={(e) => handleInputChange("passwordConfirm", e.target.value)}
          labelText="Confirm Password"
          type="password"
        />
        {fieldsErrors.passwordConfirm && (
          <p style={{ fontSize: "12px" }} className="error-msg">
            {fieldsErrors.passwordConfirm}
          </p>
        )}
      </div>

      <h1>Group:</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "1rem 0",
        }}
      >
        <ChipButton
          type="button"
          onClick={() => handleInputChange("group", "A")}
          isSelected={formFields.group === "A"}
        >
          A
        </ChipButton>
        <ChipButton
          type="button"
          onClick={() => handleInputChange("group", "B")}
          isSelected={formFields.group === "B"}
        >
          B
        </ChipButton>
        <ChipButton
          type="button"
          onClick={() => handleInputChange("group", "C")}
          isSelected={formFields.group === "C"}
        >
          C
        </ChipButton>
        <ChipButton
          type="button"
          onClick={() => handleInputChange("group", "D")}
          isSelected={formFields.group === "D"}
        >
          D
        </ChipButton>
      </div>
      {fieldsErrors.group && (
        <p style={{ fontSize: "12px" }} className="error-msg">
          {fieldsErrors.group}
        </p>
      )}

      <Button
        type="submit"
        style={{ margin: "2rem auto 0" }}
        isLoading={isPending}
      >
        Submit
      </Button>
    </form>
  );
};

export default SignUpFormComponent;
