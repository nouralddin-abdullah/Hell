import React, { useEffect, useState } from "react";
import "./style.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
}

const Input: React.FC<InputProps> = ({
  labelText,
  value,
  onChange,
  ...props
}) => {
  const [hasText, setHasText] = useState(!!value);

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

  return (
    <div className="input-field">
      <input
        {...props}
        value={value}
        onChange={handleChange}
        className={`${props.className} ${hasText ? "has-text" : ""}`}
      />
      <label className={hasText ? "has-text" : ""}>{labelText}</label>
    </div>
  );
};

export default Input;
