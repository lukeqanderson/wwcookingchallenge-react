import React, { useEffect, useRef, useState } from "react";
import "./EditChallenge.css";
import { Form, ListGroup } from "react-bootstrap";
import EditCountryListItem from "./EditCountryListItem";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { post } from "aws-amplify/api";
import Loading from "../Loading/Loading";

const EditChallenge = (props: {
  currentChallenge: any;
  setLoading: Function;
  setCurrentChallenge: Function;
  setSelectedNavButton: Function;
  deleteChallenge: Function;
  authRender: any;
}) => {
  const [loading, setLoading] = useState(true);
  const [numberSelected, setNumberSelected] = useState(0);
  const [countryApiList, setCountryApiList] = useState({});
  const rendered = useRef(0);

  useEffect(() => {
    rendered.current++;
    if (rendered.current === 1 && props.currentChallenge instanceof Array) {
      getCountriesFromApi().then();
    }
  }, []);

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
            selected:
              props.currentChallenge.find(
                (country: any) => country.country === data[i].name.common
              ) === undefined
                ? false
                : true,
            completed:
              props.currentChallenge.find(
                (country: any) =>
                  country.country === data[i].name.common &&
                  country.completed === true
              ) === undefined
                ? false
                : true,
            editCountryClasses: "editCountryItemContainer ",
          };
          newCountryObject.editCountryClasses +=
            (newCountryObject.completed === true
              ? "editCountryItemContainerCompleted "
              : "") +
            (newCountryObject.selected === true
              ? "editCountryItemContainerSelected "
              : "");
          validCountryArray.push(newCountryObject);
        }
        validCountryArray.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        if (validCountryArray.length !== 0) {
          setCountryApiList(validCountryArray);
          setNumberSelected(validCountryArray.length);
        }
        console.log("GET call successful: ", data);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("GET call failed: ", error);
      });
  };

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
            .getElementsByClassName("editCountryItemContainer")
            [i].classList.add("invisible");
        } else {
          document
            .getElementsByClassName("editCountryItemContainer")
            [i].classList.remove("invisible");
        }
      }
    }
  };

  const selectOrDeselectAllCountries = (option: string) => {
    if (countryApiList instanceof Array) {
      let countryApiListCopy = countryApiList;
      for (let i = 0; i < countryApiListCopy.length; i++) {
        if (option === "select") {
          countryApiListCopy[i].selected = true;
        } else {
          countryApiListCopy[i].selected = false;
        }
      }

      setNumberSelected(option === "select" ? countryApiListCopy.length : 0);

      setCountryApiList([...countryApiListCopy]);
      for (let i = 0; i < countryApiList.length; i++) {
        let flagImage = document.getElementsByClassName("flagImage")[
          i
        ] as HTMLElement;
        if (option === "select") {
          document
            .getElementsByClassName("editCountryItemContainer")
            [i].classList.add("editCountryItemContainerSelected");
          if (countryApiListCopy[i].completed === true) {
            document
              .getElementsByClassName("editCountryItemContainer")
              [i].classList.add("editCountryItemContainerCompleted");
          }
          flagImage.style["opacity"] = "100%";
        } else {
          document
            .getElementsByClassName("editCountryItemContainer")
            [i].classList.remove("editCountryItemContainerSelected");
          if (countryApiListCopy[i].completed === true) {
            document
              .getElementsByClassName("editCountryItemContainer")
              [i].classList.remove("editCountryItemContainerCompleted");
          }
          flagImage.style["opacity"] = "50%";
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

  const toggleCountryCompleted = (index: number) => {
    if (countryApiList instanceof Array) {
      let countryApiListCopy = countryApiList;
      if (countryApiListCopy[index].completed === true) {
        countryApiListCopy[index].completed = false;
      } else {
        countryApiListCopy[index].completed = true;
      }
      setCountryApiList([...countryApiListCopy]);
    }
  };

  async function postChallengeData() {
    if (numberSelected === 0) {
      console.log(
        "Number of countries selected for a challenge must be at least one"
      );
    } else {
      try {
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
          console.log("POST call successful: ", data);
          props.authRender.current = 0;
          props.setLoading(true);
          props.setSelectedNavButton("home", 0);
          setLoading(false);
        }
      } catch (error) {
        console.log("POST call failed: ", error);
      }
    }
  }

  const onSave = async () => {
    await props.deleteChallenge();
    await postChallengeData();
  };

  const onCancel = () => {
    props.setSelectedNavButton("home", 0);
  };

  return loading === true ? (
    <Loading></Loading>
  ) : (
    <div className="editCountryListContainer">
      {countryApiList instanceof Array && countryApiList.length > 0 ? (
        <div>
          <div className="editCountryListUtilsContainer">
            <Form.Control
              className="editCountryListUtilComponent"
              type="text"
              onChange={filterCountriesOnSearch}
              placeholder="Search Countries..."
            />
            <h4 className="editCountryListUtilComponent">
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
      <ListGroup className="editCountryList overflow-auto">
        {countryApiList instanceof Array ? (
          countryApiList.map((country, index) => (
            <EditCountryListItem
              key={index}
              index={index}
              country={country}
              toggleCountrySelected={toggleCountrySelected}
              toggleCountryCompleted={toggleCountryCompleted}
            ></EditCountryListItem>
          ))
        ) : (
          <></>
        )}
      </ListGroup>
      <div className="editCountryListContainer">
        <button
          type="button"
          className="btn btn-dark editButton"
          onClick={() => {
            onSave();
          }}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary editButton"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default EditChallenge;
