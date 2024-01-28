import React, { useEffect, useRef, useState } from "react";
import { del, get, post } from "aws-amplify/api";
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
  const [currentCountry, setCurrentCountry] = useState({});
  const [loading, setLoading] = useState(true);
  const authRender = useRef(0);

  useEffect(() => {
    if (props.route === "login") {
      props.setRoute("home");
    }
    if (authRender.current === 0) {
      getChallengeData();
    }
  }, [props.route]);

  async function getCurrentCountry() {
    try {
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = get({
        apiName: "wwcookingchallengeAPI",
        path: "/currentcountry",
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
      try {
        const data = await response.body.json();
        if (data !== null) {
          setCurrentCountry(data);
          console.log("GET call success: ", response);
        }
      } catch (error) {
        console.log("GET call success: ", "undefined");
      }
    } catch (error) {
      console.log("GET call failed: ", error);
    }
  }

  async function deleteCurrentCountry() {
    try {
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = del({
        apiName: "wwcookingchallengeAPI",
        path: "/currentcountry",
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
      setCurrentCountry({});
      console.log("DELETE call success: ", response);
    } catch (error) {
      console.log("DELETE call failed: ", error);
    }
  }

  async function postCurrentCountry(country: string) {
    try {
      setLoading(true);
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = post({
        apiName: "wwcookingchallengeAPI",
        path: "/currentcountry",
        options: {
          queryParams: {
            username: username,
          },
          headers: {
            Authorization: authToken,
          },
          body: country,
        },
      });
      const response = await restOperation.response;
      const data = await response.body.json();
      if (data !== null) {
        console.log("POST call successful: ", data);
        setLoading(false);
      }
    } catch (error) {
      console.log("POST call failed: ", error);
    }
  }

  const rollCountry = async () => {
    if (currentChallenge instanceof Array) {
      const remainingCountries = currentChallenge.filter((country) => {
        return country.completed === false;
      });
      const randomCountryIndex = Math.round(
        remainingCountries.length * Math.random()
      );
      const username = (await getCurrentUser()).username?.toString();
      const country = remainingCountries[randomCountryIndex].country;
      setCurrentCountry({
        username: username,
        country: country,
      });
      postCurrentCountry(country);
    }
  };

  async function getChallengeData() {
    try {
      getCurrentCountry();
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
          setCurrentCountry={setCurrentCountry}
          isObjectEmpty={isObjectEmpty}
          rollCountry={rollCountry}
          deleteCurrentCountry={deleteCurrentCountry}
          authRender={authRender}
          currentChallenge={currentChallenge}
          currentCountry={currentCountry}
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
