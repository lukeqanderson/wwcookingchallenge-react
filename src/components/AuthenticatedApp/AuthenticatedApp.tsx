import React, { useEffect } from "react";
import { get } from "aws-amplify/api";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import "./AuthenticatedApp.css";

const AuthenticatedApp = (props: {
  setRoute: Function;
  setSelectedNavButton: Function;
  signOut: any;
  user: Object;
}) => {
  useEffect(() => {
    props.setSelectedNavButton("home", 0);
    getChallengeData();
  }, [props]);

  async function getChallengeData() {
    try {
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      console.log(authToken);
      console.log(username);
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
      console.log(data);
    } catch (error) {
      console.log("GET call failed: ", error);
    }
  }

  const signOut = () => {
    props.setRoute("welcome");
    props.signOut();
  };
  return (
    <div>
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
