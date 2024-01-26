import React, { useEffect, useState } from "react";
import "./CountryList.css";
import { ListGroup } from "react-bootstrap";
import CountryListItem from "./CountryListItem";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { post } from "aws-amplify/api";

const CountryList = (props: {
  setCurrentChallenge: Function;
  setRoute: Function;
}) => {
  const [countryApiList, setCountryApiList] = useState<Object>([]);
  const [numberSelected, setNumberSelected] = useState(0);

  useEffect(() => {
    getCountriesFromApi();
    setNumberSelected(
      countryApiList instanceof Array ? countryApiList.length : 0
    );
  }, []);

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
      console.log(countryApiListCopy);
      setCountryApiList([...countryApiListCopy]);
    }
  };

  const getCountriesFromApi = () => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2,population")
      .then((response) => response.json())
      .then((data) => {
        let validCountryArray = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].population <= 100000) continue;
          const newCountryObject = {
            countryCode: data[i].cca2,
            name: data[i].name.common,
            selected: true,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async function postChallengeData() {
    try {
      let authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      let username = (await getCurrentUser()).username?.toString();
      if (authToken === undefined || username === undefined) throw Error;
      const restOperation = post({
        apiName: "wwcookingchallengeAPI",
        path: "/userdata",
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
        console.log("POST call success: ", data);
      }
    } catch (error) {
      console.log("POST call failed: ", error);
    }
  }

  return (
    <div className="countryListContainer">
      <h3 className="totalCountryText">
        Countries Selected: {numberSelected} /{" "}
        {countryApiList instanceof Array ? countryApiList.length : 0}
      </h3>
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
      <button
        type="button"
        className="btn btn-light beginChallengeButton"
        onClick={() => postChallengeData()}
      >
        Begin Challenge
      </button>
    </div>
  );
};

export default CountryList;