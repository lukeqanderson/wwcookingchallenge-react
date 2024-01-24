import React, { useState } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../../aws-exports";
import Welcome from "../Welcome/Welcome";
import NavbarPreauth from "../Navbar/NavbarPreauth";
import Navbar from "../Navbar/Navbar";
import AuthenticatedApp from "../AuthenticatedApp/AuthenticatedApp";
Amplify.configure(awsExports);

const App = () => {
  const [route, setRoute] = useState("welcome");

  // navbar and routing functions
  const setSelectedNavButton = (newRoute: string, i: number) => {
    let navButtons = document.getElementsByClassName("nav-link");
    for (let i = 0; i < navButtons.length; i++) {
      let navButton = navButtons[i] as HTMLElement;
      navButton!.classList.remove("selected");
    }
    navButtons[i]!.classList.add("selected");
    setRoute(newRoute);
  };

  return (
    <div>
      {route === "login" || route === "welcome" ? (
        <NavbarPreauth setSelectedNavButton={setSelectedNavButton} />
      ) : (
        <Navbar setSelectedNavButton={setSelectedNavButton} />
      )}
      <span>
        <h1 id="title">World Wide Cooking Challenge</h1>
      </span>
      {route !== "welcome" ? (
        <div className="homeContent">
          <Authenticator loginMechanisms={["email"]}>
            {({ signOut, user }: any) => (
              <div>
                <main>
                  <AuthenticatedApp
                    setRoute={setRoute}
                    setSelectedNavButton={setSelectedNavButton}
                    signOut={signOut}
                    user={user}
                  ></AuthenticatedApp>
                </main>
              </div>
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
