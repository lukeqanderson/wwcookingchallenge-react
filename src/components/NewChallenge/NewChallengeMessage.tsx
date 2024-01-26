import React from "react";
import "./NewChallenge.css";

const NewChallengeMessage = (props: { setRoute: Function }) => {
  return (
    <div id="newChallengeMessageContainer">
      <h2 className="newChallengeMessageText">
        It appears you don't currently have an active challenge.
      </h2>
      <br></br>
      <h2>
        Click the button below to choose which countries to include in your
        challenge to get started on your cooking journey!
      </h2>
    </div>
  );
};

export default NewChallengeMessage;
