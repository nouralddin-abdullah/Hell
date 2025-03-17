import React, { useState } from "react";
import Input from "../common/input/Input";
import Button from "../common/button/Button";
import { useLogin } from "../../hooks/auth/useLogin";
import { Link } from "react-router-dom";

const LoginFormComponent = () => {
  const { mutateAsync, isPending } = useLogin();

  const [formFields, setFormFields] = useState<{
    identifier: string;
    password: string;
  }>({
    identifier: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormFields((prevState) => ({ ...prevState, [field]: value }));
  };

  const [fieldsErrors, setFieldsErrors] = useState({
    identifier: "",
    password: "",
  });

  const handleErrorsChange = (field: string, msg: string) => {
    setFieldsErrors((prevState) => ({ ...prevState, [field]: msg }));
  };

  const validateFields = () => {
    let isValid = true;

    // Full Name validation
    if (formFields.identifier.trim().length < 3) {
      handleErrorsChange(
        "identifier",
        "Full Name must have at least 3 characters"
      );
      isValid = false;
    } else {
      handleErrorsChange("identifier", "");
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

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields() === false) return;

    const formData = new FormData();
    formData.append("identifier", formFields.identifier.trim());
    formData.append("password", formFields.password.trim());

    await mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="sign-up-form">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          value={formFields.identifier}
          onChange={(e) => handleInputChange("identifier", e.target.value)}
          labelText="Username or Email"
        />
        {fieldsErrors.identifier && (
          <p style={{ fontSize: "12px" }} className="error-msg">
            {fieldsErrors.identifier}
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
        <Link to="/forgot-password">Forgot Password? Click Here</Link>
      </div>

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

export default LoginFormComponent;
