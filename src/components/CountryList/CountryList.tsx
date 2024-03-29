import React, { useEffect, useRef, useState } from "react";
import "./CountryList.css";
import { Form, ListGroup } from "react-bootstrap";
import CountryListItem from "./CountryListItem";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { post } from "aws-amplify/api";
import Loading from "../Loading/Loading";

const CountryList = (props: {
  setLoading: Function;
  setCurrentChallenge: Function;
  setRoute: Function;
  setChallengeCreated: Function;
  setErrorMessage: Function;
  authRender: any;
}) => {
  const [countryApiList, setCountryApiList] = useState<Object>([]);
  const [loading, setLoading] = useState(true);
  const [numberSelected, setNumberSelected] = useState(0);
  const [noItemsSelected, setNoItemsSelected] = useState(false);
  const rendered = useRef(0);

  useEffect(() => {
    rendered.current++;
    if (rendered.current === 1) {
      getCountriesFromApi();
    }
    if (countryApiList instanceof Array) {
      setNumberSelected(countryApiList.length);
    }
  }, []);

  const filterCountriesOnSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const keyword = event.target.value;
    if (countryApiList instanceof Array) {
      for (let i = 0; i < countryApiList.length; i++) {
        if (
          countryApiList[i].name.substring(0, keyword.length).toLowerCase() !==
          keyword.toLowerCase()
        ) {
          document
            .getElementsByClassName("countryItemContainer")
            [i].classList.add("invisible");
        } else {
          document
            .getElementsByClassName("countryItemContainer")
            [i].classList.remove("invisible");
        }
      }
    }
  };

  const selectOrDeselectAllCountries = (option: string) => {
    if (countryApiList instanceof Array) {
      let countryApiListCopy = countryApiList;
      for (let i = 0; i < countryApiListCopy.length; i++) {
        let flagImage = document.getElementsByClassName("flagImage")[
          i
        ] as HTMLElement;
        if (option === "select") {
          flagImage.style["opacity"] = "100%";
          countryApiListCopy[i].selected = true;
        } else {
          countryApiListCopy[i].selected = false;
          flagImage.style["opacity"] = "50%";
        }
      }
      setNumberSelected(option === "select" ? countryApiListCopy.length : 0);
      setCountryApiList([...countryApiListCopy]);
      for (let i = 0; i < countryApiList.length; i++) {
        if (option === "select") {
          document
            .getElementsByClassName("countryItemContainer")
            [i].classList.add("countryItemContainerSelected");
        } else {
          document
            .getElementsByClassName("countryItemContainer")
            [i].classList.remove("countryItemContainerSelected");
        }
      }
    }
  };

  const toggleCountrySelected = (index: number) => {
    if (countryApiList instanceof Array) {
      let countryApiListCopy = countryApiList;
      if (countryApiListCopy[index].selected === true) {
        countryApiListCopy[index].selected = false;
        setNumberSelected(numberSelected - 1);
      } else {
        countryApiListCopy[index].selected = true;
        setNumberSelected(numberSelected + 1);
      }
      setCountryApiList([...countryApiListCopy]);
    }
  };

  const getCountriesFromApi = async () => {
    await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,population"
    )
      .then((response) => response.json())
      .then((data) => {
        let validCountryArray = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].population <= 100000) continue;
          const newCountryObject = {
            countryCode: data[i].cca2,
            name: data[i].name.common,
            selected: true,
            completed: false,
          };
          validCountryArray.push(newCountryObject);
        }
        validCountryArray.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        if (validCountryArray.length !== 0) {
          setCountryApiList(validCountryArray);
          setNumberSelected(validCountryArray.length);
        }
        console.log("GET all countries successful: ", data);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("GET all countries failed: ", error);
        props.setErrorMessage(
          "Failed to get list of all countries. Please refresh and try again."
        );
        props.setRoute("error");
      });
  };

  const postChallengeData = async () => {
    if (numberSelected == 0) {
      setNoItemsSelected(true);
    } else {
      try {
        setNoItemsSelected(false);
        await setLoading(true);
        let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
        let username = (await getCurrentUser()).username?.toString();
        if (authToken === undefined || username === undefined) throw Error;
        const restOperation = post({
          apiName: "wwcookingchallengeAPI",
          path: "/userdatabatch",
          options: {
            queryParams: {
              username: username,
            },
            headers: {
              Authorization: authToken,
            },
            body: JSON.stringify(countryApiList),
          },
        });
        const response = await restOperation.response;
        const data = await response.body.json();
        if (data !== null) {
          console.log("POST save new challenge success: ", data);
          props.authRender.current = 0;
          props.setLoading(true);
          props.setRoute("home");
          setLoading(false);
          props.setChallengeCreated(true);
        }
      } catch (error) {
        console.log("POST save new challenge failed: ", error);
        props.setErrorMessage(
          "Failed to save new challenge. Please refresh and try again."
        );
        props.setRoute("error");
      }
    }
  };

  return loading === true ? (
    <Loading></Loading>
  ) : (
    <div className="countryListContainer">
      {countryApiList instanceof Array && countryApiList.length > 0 ? (
        <div>
          <div className="countryListUtilsContainer">
            <Form.Control
              className="countryListUtilComponent"
              type="text"
              onChange={filterCountriesOnSearch}
              placeholder="Search Countries..."
            />
            <h4 className="countryListUtilComponent">
              <span
                className="selectionButton"
                onClick={() => {
                  selectOrDeselectAllCountries("select");
                }}
              >
                Select All
              </span>
              &nbsp; &nbsp; &nbsp;
              <span
                className="selectionButton"
                onClick={() => {
                  selectOrDeselectAllCountries("deselect");
                }}
              >
                Deselect All
              </span>
            </h4>
          </div>
          <h3 className="totalCountryText">
            Countries Selected: {numberSelected} / {countryApiList.length}
          </h3>
        </div>
      ) : (
        <></>
      )}
      <ListGroup className="countryList overflow-auto">
        {countryApiList instanceof Array ? (
          countryApiList.map((country, index) => (
            <CountryListItem
              key={index}
              index={index}
              country={country}
              toggleCountrySelected={toggleCountrySelected}
            ></CountryListItem>
          ))
        ) : (
          <></>
        )}
      </ListGroup>
      {noItemsSelected === true ? (
        <h4 className="noCountrySelectedText">
          Error: at least one country must be selected.
        </h4>
      ) : (
        <></>
      )}
      <button
        type="button"
        className="btn btn-dark beginChallengeButton"
        onClick={() => postChallengeData()}
      >
        Begin Challenge
      </button>
    </div>
  );
};

export default CountryList;
