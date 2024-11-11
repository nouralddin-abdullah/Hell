import React from "react";
import { TailSpin } from "react-loader-spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { isLoading, className, children, ...rest } = props;

  return (
    <button className={`btn ${className}`} {...rest} disabled={isLoading}>
      {children}
      {isLoading && (
        <TailSpin
          visible={true}
          height="30"
          width="30"
          color="#D6D6D6"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </button>
  );
};

export default Button;
