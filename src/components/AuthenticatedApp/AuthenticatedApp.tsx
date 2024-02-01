import React, { useEffect, useRef, useState } from "react";
import { del, get, post } from "aws-amplify/api";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import "./AuthenticatedApp.css";
import NewChallengeMessage from "../NewChallenge/NewChallengeMessage";
import CountryList from "../CountryList/CountryList";
import Home from "../Home.tsx/Home";
import Loading from "../Loading/Loading";
import EditChallenge from "../EditChallenge/EditChallenge";
import Country from "../Country/Country";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const AuthenticatedApp = (props: {
  setRoute: Function;
  setSelectedNavButton: Function;
  signOut: any;
  route: string;
  setChallengeCreated: Function;
}) => {
  const [currentChallenge, setCurrentChallenge] = useState({});
  const [currentCountry, setCurrentCountry] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const authRender = useRef(0);

  useEffect(() => {
    if (props.route === "login") {
      props.setRoute("home");
    }
    if (authRender.current === 0) {
      getChallengeData();
    }
  }, [props.route]);

  async function deleteChallenge() {
    try {
      setLoading(true);
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = del({
        apiName: "wwcookingchallengeAPI",
        path: "/userdatabatch",
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
      await setCurrentChallenge({});
      await deleteCurrentCountry();
      await setLoading(false);
      console.log("DELETE call success: ", response);
    } catch (error) {
      console.log("DELETE call failed: ", error);
    }
  }

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
          await setCurrentCountry(data);
          console.log("GET call success: ", data);
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
      const username = (await getCurrentUser()).username?.toString();
      const remainingCountries = currentChallenge.filter((country) => {
        return country.completed === false;
      });
      if (remainingCountries.length === 0) {
        const completedTitle = "Challenge Completed!";
        await setCurrentCountry({
          username: username,
          country: completedTitle,
        });
        postCurrentCountry(completedTitle);
      } else {
        const randomCountryIndex = Math.floor(
          remainingCountries.length * Math.random()
        );
        const country = remainingCountries[randomCountryIndex].country;
        setCurrentCountry({
          username: username,
          country: country,
        });
        postCurrentCountry(country);
      }
      props.setSelectedNavButton("country", 1);
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
        path: "/userdatabatch",
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
        if (!isObjectEmpty(data)) props.setChallengeCreated(true);
        setCurrentChallenge(data);
      } else {
        setCurrentChallenge([]);
      }
    } catch (error) {
      await setErrorMessage(
        "Error: Failed to retrieve challenge data. Please refresh and try again."
      );
      document
        .getElementsByClassName("errorMessageContainer")[0]
        .classList.remove("hidden");
      setLoading(false);
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
      <ErrorMessage message={errorMessage}></ErrorMessage>
      {loading === true ? (
        <Loading></Loading>
      ) : props.route === "home" &&
        isObjectEmpty(currentChallenge) === true &&
        currentChallenge instanceof Array ? (
        <NewChallengeMessage setRoute={props.setRoute} />
      ) : props.route === "home" && currentChallenge instanceof Array ? (
        <Home
          setRoute={props.setRoute}
          setLoading={setLoading}
          setCurrentChallenge={setCurrentChallenge}
          setCurrentCountry={setCurrentCountry}
          isObjectEmpty={isObjectEmpty}
          rollCountry={rollCountry}
          deleteCurrentCountry={deleteCurrentCountry}
          setChallengeCreated={props.setChallengeCreated}
          setSelectedNavButton={props.setSelectedNavButton}
          deleteChallenge={deleteChallenge}
          authRender={authRender}
          currentChallenge={currentChallenge}
          currentCountry={currentCountry}
        ></Home>
      ) : props.route === "countryList" ? (
        <CountryList
          setLoading={setLoading}
          setCurrentChallenge={setCurrentChallenge}
          setChallengeCreated={props.setChallengeCreated}
          setRoute={props.setRoute}
          authRender={authRender}
        ></CountryList>
      ) : props.route === "edit" ? (
        <EditChallenge
          setLoading={setLoading}
          currentChallenge={currentChallenge}
          setCurrentChallenge={setCurrentChallenge}
          setSelectedNavButton={props.setSelectedNavButton}
          deleteChallenge={deleteChallenge}
          authRender={authRender}
        ></EditChallenge>
      ) : props.route === "country" ? (
        <Country
          currentCountry={currentCountry}
          currentChallenge={currentChallenge}
          setCurrentChallenge={setCurrentChallenge}
          rollCountry={rollCountry}
          deleteChallenge={deleteChallenge}
          setRoute={props.setRoute}
        ></Country>
      ) : (
        <></>
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
