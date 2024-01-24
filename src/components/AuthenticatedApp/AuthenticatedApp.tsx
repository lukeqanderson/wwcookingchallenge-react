import React, { useEffect } from "react";
import "./AuthenticatedApp.css";

const AuthenticatedApp = (props: {
  setRoute: Function;
  setSelectedNavButton: Function;
  signOut: any;
  user: Object;
}) => {
  useEffect(() => {
    props.setSelectedNavButton("home", 0);
  }, [props]);

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