import React from "react";
import "./App.css";
import Login from "../Login/Login";

const App = () => {
  return (
    <div>
      <span>
        <h1 id="title">World Wide Cooking Challenge</h1>
      </span>
      <div className="centerScreen">
        <Login />
      </div>
    </div>
  );
};

export default App;
