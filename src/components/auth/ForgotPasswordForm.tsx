import React, { useState } from "react";
import Input from "../common/input/Input";
import Button from "../common/button/Button";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";

const ForgotPasswordFormComponent = () => {
  const { mutateAsync, isPending } = useForgotPassword();

  const [formFields, setFormFields] = useState<{
    email: string;
  }>({
    email: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormFields((prevState) => ({ ...prevState, [field]: value }));
  };

  const [fieldsErrors, setFieldsErrors] = useState({
    email: "",
    password: "",
  });

  const handleErrorsChange = (field: string, msg: string) => {
    setFieldsErrors((prevState) => ({ ...prevState, [field]: msg }));
  };

  const validateFields = () => {
    let isValid = true;

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formFields.email.trim())) {
      handleErrorsChange("email", "Please enter a valid email address");
      isValid = false;
    } else {
      handleErrorsChange("email", "");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields() === false) return;

    const formData = new FormData();
    formData.append("email", formFields.email.trim());

    await mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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

export default ForgotPasswordFormComponent;
