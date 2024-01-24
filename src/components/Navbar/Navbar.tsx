import React from "react";
import "./Navbar.css";

const Navbar = (props: { setSelectedNavButton: Function }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <button
        className="navbar-brand nav-button"
        onClick={() => {
          props.setSelectedNavButton("home", 0);
        }}
      >
        &nbsp;&nbsp;WW Cooking Challenge
      </button>
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
            <button
              className="nav-link selected"
              onClick={() => {
                props.setSelectedNavButton("home", 0);
              }}
            >
              Home
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
