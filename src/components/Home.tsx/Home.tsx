import React, { useEffect, useState } from "react";
import "./Home.css";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { del } from "aws-amplify/api";

const Home = (props: {
  setRoute: Function;
  setLoading: Function;
  setCurrentChallenge: Function;
  setCurrentCountry: Function;
  isObjectEmpty: Function;
  rollCountry: Function;
  deleteCurrentCountry: Function;
  authRender: any;
  currentChallenge: any;
  currentCountry: any;
}) => {
  const [totalCompleted, setTotalCompleted] = useState(0);

  useEffect(() => {
    if (props.currentChallenge instanceof Array) {
      setTotalCompleted(calculateTotalCompleted());
    }
  }, []);

  const calculateTotalCompleted = () => {
    let total = 0;
    for (let i = 0; i < props.currentChallenge.length; i++) {
      if (props.currentChallenge[i].completed === true) total++;
    }
    return total;
  };

  async function deleteChallenge() {
    try {
      await props.setLoading(true);
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = del({
        apiName: "wwcookingchallengeAPI",
        path: "/userdata",
        options: {
          queryParams: {
            username: username,
          },
          headers: {
            Authorization: authToken,
          },
        },
      });
      const response = await restOperation.response;
      await props.setCurrentChallenge({});
      await props.deleteCurrentCountry();
      await props.setLoading(false);
      console.log("DELETE call success: ", response);
    } catch (error) {
      console.log("DELETE call failed: ", error);
    }
  }

  return (
    <div id="homeContainer">
      <h4 className="countriesCompletedText">
        {totalCompleted} / {props.currentChallenge.length} countries completed
      </h4>
      <div className="progress">
        <div className="progress-bar bg-success" role="progressbar"></div>
      </div>
      <h4>{totalCompleted / props.currentChallenge.length}%</h4>
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
      <button
        type="button"
        className="btn btn-secondary challengeButton"
        onClick={() => {
          deleteChallenge();
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
          deleteChallenge();
        }}
      >
        Delete Challenge
      </button>
    </div>
  );
};

export default Home;
