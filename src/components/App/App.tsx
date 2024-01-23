import React, { useState } from "react";
import "./App.css";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import Welcome from "../Welcome/Welcome";
import NavbarPreauth from "../Navbar/NavbarPreauth";
import Navbar from "../Navbar/Navbar";

const App = () => {
  const [route, setRoute] = useState("welcome");
  const [authenticated, setAuthenticated] = useState(false);
  const [navButtonIndex, setNavButtonIndex] = useState(0);

  // registration functions
  const showHidePassword = (i: number) => {
    let passwordElement = document.getElementsByClassName("password")[
      i
    ] as HTMLInputElement;
    let showEye = document.getElementsByClassName("showEye")[
      i
    ] as HTMLSpanElement;
    let hideEye = document.getElementsByClassName("hideEye")[
      i
    ] as HTMLSpanElement;
    if (showEye === null || hideEye === null) return;
    hideEye!.classList.remove("d-none");
    if (passwordElement.type === "password") {
      passwordElement.type = "text";
      showEye!.style.display = "none";
      hideEye!.style.display = "block";
    } else {
      passwordElement.type = "password";
      showEye!.style.display = "block";
      hideEye!.style.display = "none";
    }
  };

  // navbar functions
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
      {authenticated === false ? (
        <NavbarPreauth setSelectedNavButton={setSelectedNavButton} />
      ) : (
        <Navbar setSelectedNavButton={setSelectedNavButton} />
      )}
      <span>
        <h1 id="title">World Wide Cooking Challenge</h1>
      </span>
      {route === "login" || route === "signup" ? (
        <div className="centerScreen">
          {route === "login" ? (
            <Login setRoute={setRoute} showHidePassword={showHidePassword} />
          ) : (
            <Signup setRoute={setRoute} showHidePassword={showHidePassword} />
          )}
        </div>
      ) : route === "welcome" ? (
        <Welcome setRoute={setRoute} />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default App;
