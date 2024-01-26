import React from "react";
import "./NewChallenge.css";

const NewChallengeMessage = (props: { setRoute: Function }) => {
  return (
    <div id="newChallengeMessageContainer">
      <h2 className="newChallengeMessageText">
        It appears you don't currently have an active challenge.
      </h2>
      <br></br>
      <h2>Click the button below to start a new challenge!</h2>
      <button
        type="button"
        className="btn btn-light newChallengeButton"
        onClick={() => {
          props.setRoute("countryList");
        }}
      >
        New Challenge
      </button>
    </div>
  );
};

export default NewChallengeMessage;
