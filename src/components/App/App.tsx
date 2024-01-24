import React, { useState } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../../aws-exports";
import Login from "../Login/Login";
import Welcome from "../Welcome/Welcome";
import NavbarPreauth from "../Navbar/NavbarPreauth";
import Navbar from "../Navbar/Navbar";
Amplify.configure(awsExports);

const App = () => {
  const [route, setRoute] = useState("welcome");
  const [navButtonIndex, setNavButtonIndex] = useState(0);

  // navbar and routing functions
  const setSelectedNavButton = (newRoute: string, i: number) => {
    let toActivateNavButton = document.getElementsByClassName("nav-link")[
      i
    ] as HTMLElement;
    let prevActivatedNavButton = document.getElementsByClassName("nav-link")[
      navButtonIndex
    ] as HTMLElement;
    prevActivatedNavButton!.classList.remove("selected");
    toActivateNavButton!.classList.add("selected");
    setNavButtonIndex(i);
    setRoute(newRoute);
  };

  return (
    <div>
      {route == "login" || route == "welcome" ? (
        <NavbarPreauth setSelectedNavButton={setSelectedNavButton} />
      ) : (
        <Navbar setSelectedNavButton={setSelectedNavButton} />
      )}
      <span>
        <h1 id="title">World Wide Cooking Challenge</h1>
      </span>
      {route == "login" ? (
        <div className="centerScreen">
          <Authenticator loginMechanisms={["email"]}>
            {({ signOut, user }: any) => (
              <main>
                <button onClick={signOut}>Sign out</button>
              </main>
            )}
          </Authenticator>
        </div>
      ) : (
        <Welcome setSelectedNavButton={setSelectedNavButton} />
      )}
    </div>
  );
};

export default App;
