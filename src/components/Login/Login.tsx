import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Form, Button } from "react-bootstrap";
import "./Login.css";

const Login = (props: { setRoute: Function; showHidePassword: Function }) => {
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
              className="password inputText"
              type="password"
              placeholder="Password"
            ></Form.Control>
            <span
              className="showHideIcons"
              onClick={() => {
                props.showHidePassword(0);
              }}
            >
              <FontAwesomeIcon
                className="showEye"
                icon={faEye}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                className="hideEye d-none"
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
          <span
            id="registrationButton"
            onClick={() => {
              props.setRoute("signup");
            }}
          >
            sign up here!
          </span>
        </div>
      </Form>
    </div>
  );
};

export default Login;
