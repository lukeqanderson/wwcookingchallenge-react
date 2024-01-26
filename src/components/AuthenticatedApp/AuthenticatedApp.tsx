import React, { useEffect, useState } from "react";
import { get } from "aws-amplify/api";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import "./AuthenticatedApp.css";
import NewChallengeMessage from "../NewChallenge/NewChallengeMessage";
import CountryList from "../CountryList/CountryList";

const AuthenticatedApp = (props: {
  setRoute: Function;
  setSelectedNavButton: Function;
  signOut: any;
  user: Object;
  route: string;
}) => {
  const [currentChallenge, setCurrentChallenge] = useState({});
  const [currentCountry, setCurrentCountry] = useState("");

  useEffect(() => {
    getChallengeData();
    if (props.route === "login") {
      props.setRoute("home");
    }
  }, [props]);

  async function getChallengeData() {
    try {
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = get({
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
      const data = await response.body.json();
      if (data !== null) {
        setCurrentChallenge(data);
      }
    } catch (error) {
      console.log("GET call failed: ", error);
    }
  }

  const isObjectEmpty = (object: Object) => {
    for (let property in object) {
      if (Object.prototype.hasOwnProperty.call(object, property)) return false;
    }
    return true;
  };

  const signOut = () => {
    props.setRoute("welcome");
    props.signOut();
  };

  return (
    <div>
      {props.route === "home" && isObjectEmpty(currentChallenge) === true ? (
        <NewChallengeMessage setRoute={props.setRoute} />
      ) : props.route === "home" ? (
        <h2>has items</h2>
      ) : props.route === "countryList" ? (
        <CountryList
          setCurrentChallenge={setCurrentChallenge}
          setRoute={props.setRoute}
        ></CountryList>
      ) : (
        <div></div>
      )}
      <button
        type="button"
        className="btn btn-transparent signOutButton"
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default AuthenticatedApp;
