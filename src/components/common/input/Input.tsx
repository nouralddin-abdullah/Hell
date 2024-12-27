import React, { useEffect, useState } from "react";
import "./style.css";
import { EyeIcon, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
}

const Input: React.FC<InputProps> = ({
  labelText,
  value,
  onChange,
  type = "text",
  ...props
}) => {
  const [hasText, setHasText] = useState(!!value);
  const [inputType, setInputType] = useState(type);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setHasText(value.toString().length > 0);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setHasText(inputValue.length > 0);

    if (onChange) onChange(e);
  };

  const handleLabelClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  return (
    <>
      <div className="input-field">
        <div className="input-container">
          <input
            ref={inputRef}
            {...props}
            type={inputType}
            value={value}
            onChange={handleChange}
            className={`${props.className} ${hasText ? "has-text" : ""}`}
          />
          <label
            className={hasText ? "has-text" : ""}
            onClick={handleLabelClick}
          >
            {labelText}
          </label>
        </div>
      </div>
      {type === "password" && (
        <button
          type="button"
          className="toggle-password"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
        >
          {inputType === "password" ? <EyeOff /> : <EyeIcon />}
        </button>
      )}
    </>
  );
};

export default Input;
