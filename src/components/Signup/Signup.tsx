import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Form, Button } from "react-bootstrap";
import "./Signup.css";

const Signup = (props: { setRoute: Function; showHidePassword: Function }) => {
  return (
    <div id="signupParent">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <h1 id="signupTitle">Sign Up</h1>
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
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="formLabel">Confirm Password</Form.Label>
          <div id="passwordContainer">
            <Form.Control
              className="password inputText"
              type="password"
              placeholder="Password"
            ></Form.Control>
            <span
              className="showHideIcons"
              onClick={() => {
                props.showHidePassword(1);
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
        <Button id="signupButton" variant="success" type="submit">
          Submit
        </Button>
        <div id="registrationParent">
          Already have an account?{" "}
          <span
            id="registrationButton"
            onClick={() => {
              props.setRoute("login");
            }}
          >
            login here!
          </span>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
