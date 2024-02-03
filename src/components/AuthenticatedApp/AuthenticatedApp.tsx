import React, { useEffect, useRef, useState } from "react";
import { del, get, post } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import "./AuthenticatedApp.css";
import NewChallengeMessage from "../NewChallenge/NewChallengeMessage";
import CountryList from "../CountryList/CountryList";
import Home from "../Home/Home";
import Loading from "../Loading/Loading";
import EditChallenge from "../EditChallenge/EditChallenge";
import Country from "../Country/Country";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const AuthenticatedApp = (props: {
  signOut: any;
  route: string;
  user: any;
  setChallengeCreated: Function;
  setRoute: Function;
  setSelectedNavButton: Function;
}) => {
  const [currentChallenge, setCurrentChallenge] = useState({});
  const [currentCountry, setCurrentCountry] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const username = props.user.username?.toString();
  const authRender = useRef(0);

  useEffect(() => {
    if (props.route === "login") {
      props.setRoute("home");
    }
    authRender.current++;
    if (authRender.current === 1) {
      getChallenge();
    }
  }, [props.route]);

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

  const getCurrentCountry = async () => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
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
          console.log("GET current country success: ", data);
        }
      } catch (error) {
        console.log(
          "GET current country success (empty country): ",
          "undefined"
        );
        setLoading(false);
      }
    } catch (error) {
      console.log("GET call failed: ", error);
      await setErrorMessage(
        "Error: Failed to retrieve current country data. Please refresh and try again."
      );
      props.setRoute("error");
      setLoading(false);
      console.log("GET current country failed: ", error);
    }
  };

  const deleteCurrentCountry = async () => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
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
      console.log("DELETE current country success: ", response);
    } catch (error) {
      console.log("DELETE current country failed: ", error);
      await setErrorMessage(
        "Error: Failed to delete current country data. Please refresh and try again."
      );
      props.setRoute("error");
      setLoading(false);
    }
  };

  const postCurrentCountry = async (country: string) => {
    try {
      setLoading(true);
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
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
        console.log("POST current country success: ", data);
        setLoading(false);
      }
    } catch (error) {
      console.log("POST current country failed: ", error);
      await setErrorMessage(
        "Error: Failed to send challenge data. Please refresh and try again."
      );
      props.setRoute("error");
      setLoading(false);
    }
  };

  const rollCountry = async () => {
    try {
      if (currentChallenge instanceof Array) {
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
    } catch (error) {
      console.log("Roll country failed: ", error);
      await setErrorMessage(
        "Error: Failed to roll country. Please refresh and try again."
      );
      props.setRoute("error");
    }
  };

  const getChallenge = async () => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      getCurrentCountry();
      authRender.current++;
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
        console.log("GET challenge success: ", data);
        setLoading(false);
        if (!isObjectEmpty(data)) props.setChallengeCreated(true);
        setCurrentChallenge(data);
      } else {
        setCurrentChallenge([]);
      }
    } catch (error) {
      console.log("GET challenge failed: ", error);
      await setErrorMessage(
        "Error: Failed to retrieve challenge data. Please refresh and try again."
      );
      props.setRoute("error");
      setLoading(false);
    }
  };

  const deleteChallenge = async () => {
    try {
      setLoading(true);
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
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
      await setCurrentChallenge([]);
      await deleteCurrentCountry();
      console.log("DELETE challenge success: ", response);
    } catch (error) {
      console.log("DELETE challenge failed: ", error);
      await setErrorMessage(
        "Error: Failed to delete challenge data. Please refresh and try again."
      );
      props.setRoute("error");
    }
  };

  return (
    <div>
      {props.route === "error" ? (
        <ErrorMessage message={errorMessage}></ErrorMessage>
      ) : (
        <></>
      )}
      {loading === true ? (
        <Loading></Loading>
      ) : props.route === "home" &&
        currentChallenge instanceof Array &&
        currentChallenge.length === 0 ? (
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
          setErrorMessage={setErrorMessage}
          authRender={authRender}
        ></CountryList>
      ) : props.route === "edit" ? (
        <EditChallenge
          setLoading={setLoading}
          currentChallenge={currentChallenge}
          setCurrentChallenge={setCurrentChallenge}
          setSelectedNavButton={props.setSelectedNavButton}
          deleteChallenge={deleteChallenge}
          setErrorMessage={setErrorMessage}
          setRoute={props.setRoute}
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
          setErrorMessage={setErrorMessage}
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
