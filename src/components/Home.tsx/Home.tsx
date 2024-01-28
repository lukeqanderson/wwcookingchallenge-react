import React from "react";
import "./Home.css";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { del } from "aws-amplify/api";

const Home = (props: {
  setRoute: Function;
  setLoading: Function;
  setCurrentChallenge: Function;
  authRender: any;
}) => {
  async function deleteChallenge() {
    try {
      props.setLoading(true);
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
      props.setCurrentChallenge({});
      props.setLoading(false);
      props.authRender.current = 0;
      console.log("DELETE call success: ", response);
    } catch (error) {
      console.log("DELETE call failed: ", error);
    }
  }

  return (
    <div id="homeContainer">
      <button
        type="button"
        className="btn btn-danger deleteChallengeButton"
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
