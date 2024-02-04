import React, { useEffect, useState } from "react";
import "./Home.css";
import ConfirmationBox from "../ConfirmationBox/ConfirmationBox";
import { ProgressBar } from "react-bootstrap";

const Home = (props: {
  setRoute: Function;
  setLoading: Function;
  setCurrentChallenge: Function;
  setCurrentCountry: Function;
  isObjectEmpty: Function;
  rollCountry: Function;
  deleteCurrentCountry: Function;
  setSelectedNavButton: Function;
  setChallengeCreated: Function;
  deleteChallenge: Function;
  newChallenge: Function;
  authRender: any;
  currentChallenge: any;
  currentCountry: any;
}) => {
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [confirmationRoute, setConfirmationRoute] = useState("");

  useEffect(() => {
    const calculateTotalCompleted = () => {
      let total = 0;
      for (let i = 0; i < props.currentChallenge.length; i++) {
        if (props.currentChallenge[i].completed === true) total++;
      }
      return total;
    };
    if (props.currentChallenge instanceof Array) {
      const totalCompleted = calculateTotalCompleted();
      setTotalCompleted(totalCompleted);
      if (totalCompleted === props.currentChallenge.length) {
        props.setCurrentCountry({ country: "Challenge Completed!" });
      }
    }
  }, [props.currentChallenge]);

  const cancelChallengeDeletion = () => {
    setConfirmationRoute("");
    document.getElementsByTagName("html")[0].style.overflow = "auto";
  };

  const confirmChallengeDeletion = async () => {
    await props.deleteChallenge();
    await props.setChallengeCreated(false);
    await setConfirmationRoute("");
    document.getElementsByTagName("html")[0].style.overflow = "auto";
    await props.setLoading(false);
  };

  return (
    <>
      {confirmationRoute === "confirmDelete" ? (
        <ConfirmationBox
          confirmationMessage={
            "Are you sure you want to delete the current challenge?"
          }
          onCancel={cancelChallengeDeletion}
          onConfirm={confirmChallengeDeletion}
        ></ConfirmationBox>
      ) : (
        <></>
      )}
      <div id="homeContainer">
        <h4 className="countriesCompletedText">
          {totalCompleted} / {props.currentChallenge.length} countries completed
        </h4>
        <div className="progress">
          <ProgressBar
            variant="success"
            now={(totalCompleted / props.currentChallenge.length) * 100}
          ></ProgressBar>
        </div>
        <h4>
          {((totalCompleted / props.currentChallenge.length) * 100).toFixed(2)}%
        </h4>
        {props.isObjectEmpty(props.currentCountry) === true ? (
          <div className="currentCountryTextContainer">
            <h4>No current country</h4>
            <h4>hit "roll country" to randomly select a new country</h4>
          </div>
        ) : (
          <div className="currentCountryTextContainer">
            <h4>Current country: {props.currentCountry.country}</h4>
          </div>
        )}
        {props.currentCountry.country === "Challenge Completed!" ? (
          <div>
            <button
              type="button"
              className="btn btn-dark newChallengeButton"
              onClick={() => {
                props.newChallenge();
              }}
            >
              New Challenge
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="btn btn-secondary challengeButton"
              onClick={() => {
                props.setSelectedNavButton("edit", 2);
              }}
            >
              Edit Challenge
            </button>
            <button
              type="button"
              className="btn btn-dark challengeButton"
              onClick={() => {
                props.rollCountry();
              }}
            >
              Roll Country
            </button>
            <button
              type="button"
              className="btn btn-danger challengeButton"
              onClick={() => {
                setConfirmationRoute("confirmDelete");
              }}
            >
              Delete Challenge
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
