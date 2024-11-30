import React, { useEffect, useState } from "react";
import "./style.css";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelText: string;
}

const Textarea: React.FC<TextareaProps> = ({
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaValue = e.target.value;
    setHasText(textareaValue.length > 0);

    if (onChange) onChange(e);
  };

  return (
    <div className="textarea-field">
      <textarea
        {...props}
        value={value}
        onChange={handleChange}
        className={`${props.className || ""} ${hasText ? "has-text" : ""}`}
      />
      <label className={hasText ? "has-text" : ""}>{labelText}</label>
    </div>
  );
};

export default Textarea;
