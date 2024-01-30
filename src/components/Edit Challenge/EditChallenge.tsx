import React, { useEffect, useRef, useState } from "react";
import "./EditChallenge.css";

const EditChallenge = (props: { currentChallenge: any }) => {
  const [loading, setLoading] = useState(true);
  const [newChallenge, setNewChallenge] = useState({});
  const [numberSelected, setNumberSelected] = useState(0);
  const [countryList, setCountryList] = useState({});
  const rendered = useRef(0);

  useEffect(() => {
    rendered.current++;
    if (rendered.current === 1) {
      getCountriesFromApi();
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
          };
          validCountryArray.push(newCountryObject);
        }
        validCountryArray.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        if (validCountryArray.length !== 0) {
          setNewChallenge(validCountryArray);
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

  const onSave = () => {};

  const onCancel = () => {};

  return (
    <div className="editChallengeContainer">
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
  );
};
export default EditChallenge;
