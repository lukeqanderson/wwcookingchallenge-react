import React, { useEffect } from "react";
import "./ConfirmationBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

const ConfirmationBox = (props: {
  confirmationMessage: String;
  onConfirm: Function;
  onCancel: Function;
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
  }, []);
  return (
    <div>
      <div className="confirmationBoxBackground"></div>
      <div className="confirmationBoxContainer">
        <FontAwesomeIcon
          className="closeButton"
          icon={faWindowClose}
          onClick={() => {
            props.onCancel();
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.confirmationMessage}</h5>
          <button
            className="btn confirmCancelButton btn-dark"
            onClick={() => {
              props.onConfirm();
            }}
          >
            Confirm
          </button>
          <button
            className="btn confirmCancelButton btn-secondary"
            onClick={() => {
              props.onCancel();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationBox;
