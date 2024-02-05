import React, { useEffect, useState } from "react";
import "./Settings.css";
import ConfirmationBox from "../ConfirmationBox/ConfirmationBox";
import { deleteUser } from "aws-amplify/auth";

const Settings = (props: {
  deleteChallenge: Function;
  setChallengeCreated: Function;
  setLoading: Function;
  deleteCurrentCountry: Function;
  setErrorMessage: Function;
  setRoute: Function;
}) => {
  const [confirmationRoute, setConfirmationRoute] = useState("");

  const cancelAccountDeletion = () => {
    setConfirmationRoute("");
    document.getElementsByTagName("html")[0].style.overflow = "auto";
  };

  const confirmAccountDeletion = async () => {
    await props.deleteChallenge();
    await props.deleteCurrentCountry();
    await props.setChallengeCreated(false);
    document.getElementsByTagName("html")[0].style.overflow = "auto";
    try {
      await props.setRoute("welcome");
      await deleteUser();
      setConfirmationRoute("");
      await props.setLoading(false);
    } catch (error) {
      console.log("Failed to delete account: ", error);
      await props.setErrorMessage(
        "Error: Failed to delete challenge data. Please refresh and try again."
      );
      props.setRoute("error");
    }
  };

  return (
    <>
      {confirmationRoute === "confirmAccountDelete" ? (
        <ConfirmationBox
          confirmationMessage={
            "Are you sure you want to delete your account (all data will be deleted)?"
          }
          onCancel={cancelAccountDeletion}
          onConfirm={confirmAccountDeletion}
        ></ConfirmationBox>
      ) : (
        <div className="settingsContainer">
          <button
            type="button"
            className="btn btn-danger deleteAccountButton"
            onClick={() => {
              setConfirmationRoute("confirmAccountDelete");
            }}
          >
            Delete Account
          </button>
        </div>
      )}
    </>
  );
};

export default Settings;
