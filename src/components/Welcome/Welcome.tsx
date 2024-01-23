import React from "react";
import "./Welcome.css";

const Welcome = (props: { setRoute: Function }) => {
  return (
    <div id="welcomeContainer">
      <h4 id="welcomeText">
        Welcome to the World Wide Cooking Challenge! <br></br>
        <br></br>The challenge is to prepare a dish from a random country until
        you have completed every country in the world. We believe that food is
        one of the best ways to explore culture, history, and tradition, since
        every ingredient, cooking style, and serving style tell a story.
        <br></br>
        <br></br>While we encourage you to try and tackle every country, the app
        will allow you to remove countries as we don't want external factors
        like cost and availability of ingredients to limit completing the
        challenge successfully.
      </h4>
      <div id="buttonContainer">
        <button
          type="button"
          className="btn btn-light authButton"
          onClick={() => {
            props.setRoute("login");
          }}
        >
          Login
        </button>
        <button
          type="button"
          className="btn btn-dark authButton"
          onClick={() => {
            props.setRoute("signup");
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Welcome;
