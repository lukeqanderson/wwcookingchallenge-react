import React from "react";
import "./ErrorMessage.css";

const ErrorMessage = (props: { message: string }) => {
  return (
    <div className="errorMessageContainer hidden">
      <h4>{props.message}</h4>
    </div>
  );
};

export default ErrorMessage;
