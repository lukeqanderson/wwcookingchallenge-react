import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Form, Button } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  const showHidePassword = () => {
    let passwordElement = document.getElementById(
      "password"
    ) as HTMLInputElement;
    let showEye = document.getElementById("showEye");
    let hideEye = document.getElementById("hideEye");
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
    <div id="loginParent">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <h1 id="loginTitle">Login</h1>
          <Form.Label className="formLabel">Email</Form.Label>
          <Form.Control
            className="inputText"
            type="email"
            placeholder="Email"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="formLabel">Password</Form.Label>
          <div id="passwordContainer">
            <Form.Control
              className="inputText"
              id="password"
              type="password"
              placeholder="Password"
            ></Form.Control>
            <span className="showHideIcons" onClick={showHidePassword}>
              <FontAwesomeIcon id="showEye" icon={faEye}></FontAwesomeIcon>
              <FontAwesomeIcon
                className="d-none"
                id="hideEye"
                icon={faEyeSlash}
              ></FontAwesomeIcon>
            </span>
          </div>
        </Form.Group>
        <Button id="loginButton" variant="success" type="submit">
          Submit
        </Button>
        <div id="registrationParent">
          Don't have an account?{" "}
          <span id="registrationButton">sign up here!</span>
        </div>
      </Form>
    </div>
  );
};

export default Login;
