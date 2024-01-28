import React, { useEffect, useState } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../../aws-exports";
import Welcome from "../Welcome/Welcome";
import NavbarPreauth from "../Navbar/NavbarPreauth";
import NavbarAuth from "../Navbar/NavbarAuth";
import AuthenticatedApp from "../AuthenticatedApp/AuthenticatedApp";
import { getCurrentUser } from "aws-amplify/auth";
import Loading from "../Loading/Loading";
Amplify.configure(awsExports);

const App = () => {
  const [route, setRoute] = useState("welcome");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIsSignedIn = async () => {
      try {
        await getCurrentUser();
        await setSelectedNavButton("home", 0);
        setLoading(false);
      } catch {
        await setSelectedNavButton("welcome", 0);
        setLoading(false);
      }
    };
    checkIsSignedIn();
  }, []);

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
        <NavbarAuth setSelectedNavButton={setSelectedNavButton} />
      )}
      <span>
        <h1 id="title">World Wide Cooking Challenge</h1>
      </span>
      {route !== "welcome" && loading === false ? (
        <div className="homeContent">
          <Authenticator loginMechanisms={["email"]}>
            {({ signOut, user }: any) => (
              <div>
                <main>
                  <AuthenticatedApp
                    setRoute={setRoute}
                    setSelectedNavButton={setSelectedNavButton}
                    signOut={signOut}
                    route={route}
                  ></AuthenticatedApp>
                </main>
              </div>
            )}
          </Authenticator>
        </div>
      ) : loading === false ? (
        <Welcome setSelectedNavButton={setSelectedNavButton} />
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default App;
