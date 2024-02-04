import React, { useEffect, useRef, useState } from "react";
import "./Country.css";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { get, post } from "aws-amplify/api";
import Loading from "../Loading/Loading";

const Country = (props: {
  currentChallenge: any;
  setCurrentChallenge: Function;
  currentCountry: any;
  rollCountry: Function;
  deleteChallenge: Function;
  newChallenge: Function;
  setRoute: Function;
  setErrorMessage: Function;
}) => {
  const prompt =
    "write a paragraph describing the history, culture, and cooking style of " +
    props.currentCountry.country +
    ". Then write a bullet point list with a newline between each bullet point of five unique foods to " +
    props.currentCountry.country +
    " which includes it's national dish if it has one.";
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const render = useRef(0);

  useEffect(() => {
    render.current++;
    if (render.current === 1) {
      getDescription();
    }
  }, []);

  const getDescription = async () => {
    try {
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      if (authToken === undefined) throw Error;
      const restOperation = get({
        apiName: "wwcookingchallengeAPI",
        path: "/countrydesc",
        options: {
          queryParams: {
            country: props.currentCountry.country,
          },
          headers: {
            Authorization: authToken,
          },
        },
      });
      const response = await restOperation.response;
      const data = await response.body.json();
      await setApiResponse((data as any).description);
      console.log("GET call success: ", data);
      await setLoading(false);
      render.current = 0;
    } catch (error) {
      console.log(
        "No description found in db, generating from OpenAI api and saving to db."
      );
      await getApiResponseAndUpdateDb();
    }
  };

  const getApiResponseAndUpdateDb = async () => {
    try {
      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4-turbo-preview",
          messages: [{ role: "user", content: prompt }],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setApiResponse(data.choices[0].message.content);
          postCurrentCountry(
            props.currentCountry.country,
            data.choices[0].message.content
          );
          console.log("Generating new description with openAI successful");
          render.current = 0;
        });
    } catch (error) {
      console.log("Generating new description with openAI failed");
      props.setErrorMessage(
        "Failed to generate new description with openAI. Please refresh and try again."
      );
      props.setRoute("error");
      await setLoading(false);
    }
  };

  const postCurrentCountry = async (country: string, description: string) => {
    try {
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      if (authToken === undefined) throw Error;
      const restOperation = post({
        apiName: "wwcookingchallengeAPI",
        path: "/countrydesc",
        options: {
          queryParams: {
            country: country,
          },
          headers: {
            Authorization: authToken,
          },
          body: description,
        },
      });
      const response = await restOperation.response;
      const data = await response.body.json();
      if (data !== null) {
        console.log("POST set country description successful: ", data);
      }
      await setLoading(false);
    } catch (error) {
      console.log("POST set country description failed: ", error);
      props.setErrorMessage(
        "Failed to send country description. Please refresh and try again."
      );
      props.setRoute("error");
      await setLoading(false);
    }
  };

  const postCountryCompleted = async () => {
    try {
      await setLoading(true);
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = post({
        apiName: "wwcookingchallengeAPI",
        path: "/userdata",
        options: {
          queryParams: {
            username: username,
          },
          headers: {
            Authorization: authToken,
          },
          body: JSON.stringify({
            country: props.currentCountry.country,
            completed: true,
          }),
        },
      });
      const response = await restOperation.response;
      const data = await response.body.json();
      if (data !== null) {
        console.log("POST country completed successful: ", data);
        await markComplete(props.currentCountry.country);
        await props.rollCountry();
        await setLoading(false);
      }
    } catch (error) {
      console.log("POST country completed failed: ", error);
      props.setErrorMessage(
        "Failed to mark country as complete. Please refresh and try again."
      );
      props.setRoute("error");
      await setLoading(false);
    }
  };

  const markComplete = (country: string) => {
    let currentChallengeCopy = props.currentChallenge;
    if (currentChallengeCopy instanceof Array) {
      for (let i = 0; i < currentChallengeCopy.length; i++) {
        if (currentChallengeCopy[i].country === country) {
          currentChallengeCopy[i].completed = true;
          break;
        }
      }
    }
    props.setCurrentChallenge(currentChallengeCopy);
  };

  return (
    <div className="countryContainer">
      {loading === false ? (
        <div>
          {props.currentCountry.country !== undefined ? (
            <div>
              <h1 className="countryTitle">{props.currentCountry.country}</h1>
              {props.currentCountry.country !== "Challenge Completed!" ? (
                <div>
                  <p className="countryDescription">{apiResponse}</p>
                  <p className="aiNote">
                    All descriptions are AI generated, email
                    wwcookingchallenge@proton.me if there is misinformation!
                  </p>
                  <div className="challengeButtonContainer">
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
                      className="btn btn-success challengeButton"
                      onClick={() => {
                        postCountryCompleted();
                      }}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="completedChallengeContainer">
                  <p className="countryDescription">{apiResponse}</p>
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
              )}
            </div>
          ) : (
            <div>
              <h3 className="countryTitle">
                No country selected, click "Roll Country" to randomly select a
                country from your challenge!
              </h3>
              <div className="challengeButtonContainer">
                <button
                  type="button"
                  className="btn btn-dark challengeButton"
                  onClick={() => {
                    props.rollCountry();
                  }}
                >
                  Roll Country
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default Country;
