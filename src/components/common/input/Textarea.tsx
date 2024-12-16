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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

  const handleLabelClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="textarea-field">
      <textarea
        ref={textareaRef}
        {...props}
        value={value}
        onChange={handleChange}
        className={`${props.className || ""} ${hasText ? "has-text" : ""}`}
      />
      <label className={hasText ? "has-text" : ""} onClick={handleLabelClick}>
        {labelText}
      </label>
    </div>
  );
};

export default Textarea;
