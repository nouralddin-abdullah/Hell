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

  return (
    <div className="input-field">
      <input
        ref={inputRef}
        {...props}
        value={value}
        onChange={handleChange}
        className={`${props.className} ${hasText ? "has-text" : ""}`}
      />
      <label className={hasText ? "has-text" : ""} onClick={handleLabelClick}>
        {labelText}
      </label>
    </div>
  );
};

export default Input;
