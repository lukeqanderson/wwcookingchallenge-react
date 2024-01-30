import React from "react";
import "./Navbar.css";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavbarAuth = (props: {
  setSelectedNavButton: Function;
  challengeCreated: Boolean;
}) => {
  return (
    <>
      <Navbar
        data-bs-theme="dark"
        className="navbar bg-body-tertiary fixed-top"
        expand="lg"
      >
        <Container className="navContainer">
          <Navbar.Toggle
            className="navHamburgerMenu"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Brand
            className="navbar-brand nav-button"
            onClick={() => {
              props.setSelectedNavButton("home", 0);
            }}
          >
            &nbsp;&nbsp;WW Cooking Challenge
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                className="nav-link selected"
                onClick={() => {
                  props.setSelectedNavButton("home", 0);
                }}
              >
                Home
              </Nav.Link>
              {props.challengeCreated === true ? (
                <>
                  <Nav.Link
                    className="nav-link"
                    onClick={() => {
                      props.setSelectedNavButton("country", 1);
                    }}
                  >
                    Country
                  </Nav.Link>
                  <Nav.Link
                    className="nav-link"
                    onClick={() => {
                      props.setSelectedNavButton("edit", 2);
                    }}
                  >
                    Edit
                  </Nav.Link>
                </>
              ) : (
                <></>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarAuth;
