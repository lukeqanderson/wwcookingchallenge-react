import React, { useEffect, useRef, useState } from "react";
import { get } from "aws-amplify/api";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import "./AuthenticatedApp.css";
import NewChallengeMessage from "../NewChallenge/NewChallengeMessage";
import CountryList from "../CountryList/CountryList";
import Home from "../Home.tsx/Home";
import Loading from "../Loading/Loading";

const AuthenticatedApp = (props: {
  setRoute: Function;
  setSelectedNavButton: Function;
  signOut: any;
  route: string;
}) => {
  const [currentChallenge, setCurrentChallenge] = useState({});
  const [currentCountry, setCurrentCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const authRender = useRef(0);

  useEffect(() => {
    if (props.route === "login") {
      props.setRoute("home");
    }
    if (authRender.current === 0) getChallengeData();
  }, [props.route]);

  async function getChallengeData() {
    try {
      authRender.current++;
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
        console.log("GET call success: ", data);
        setLoading(false);
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
      {loading === true ? (
        <Loading></Loading>
      ) : props.route === "home" && isObjectEmpty(currentChallenge) === true ? (
        <NewChallengeMessage setRoute={props.setRoute} />
      ) : props.route === "home" ? (
        <Home
          setRoute={props.setRoute}
          setLoading={setLoading}
          setCurrentChallenge={setCurrentChallenge}
          authRender={authRender}
        ></Home>
      ) : props.route === "countryList" ? (
        <CountryList
          setLoading={setLoading}
          setCurrentChallenge={setCurrentChallenge}
          setRoute={props.setRoute}
          authRender={authRender}
        ></CountryList>
      ) : (
        <Loading></Loading>
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
