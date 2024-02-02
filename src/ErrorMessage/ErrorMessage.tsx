import React, { useEffect } from "react";
import "./ErrorMessage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

const ErrorMessage = (props: { message: string }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
  }, []);

  return (
    <div>
      <div className="confirmationBoxBackground"></div>
      <div className="confirmationBoxContainer">
        <div className="card-body errorMessageContainer">
          <h4>{props.message}</h4>
          <p>Email wwcookingchallenge@proton.me if error persists.</p>
        </div>
      </div>
    </div>
  );
};
export default ErrorMessage;
