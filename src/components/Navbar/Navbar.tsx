import React from "react";
import "./Navbar.css";

const Navbar = (props: { setSelectedNavButton: Function }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <a
        className="navbar-brand nav-button"
        onClick={() => {
          props.setSelectedNavButton("welcome", 0);
        }}
      >
        &nbsp;&nbsp;WW Cooking Challenge
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item nav-button active">
            <a
              className="nav-link selected"
              onClick={() => {
                props.setSelectedNavButton("item1", 0);
              }}
            >
              Home
            </a>
          </li>
          <li className="nav-item nav-button active">
            <a
              className="nav-link"
              onClick={() => {
                props.setSelectedNavButton("item2", 1);
              }}
            >
              Login
            </a>
          </li>
          <li className="nav-item nav-button active">
            <a
              className="nav-link"
              onClick={() => {
                props.setSelectedNavButton("item3", 2);
              }}
            >
              Sign Up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;