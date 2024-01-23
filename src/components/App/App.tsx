import React, { useState } from "react";
import "./App.css";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

const App = () => {
  const [route, setRoute] = useState("login");

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

  return (
    <div>
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
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default App;
