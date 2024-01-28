import React from "react";
import "./CountryList.css";
import { ListGroup } from "react-bootstrap";

const CountryListItem = (props: {
  index: number;
  country: { countryCode: string; name: string; selected: boolean };
  toggleCountrySelected: Function;
}) => {
  const flagApiPath =
    "https://flagsapi.com/" + props.country.countryCode + "/flat/64.png";

  const toggleSelectedCountryAndListItemStyles = (index: number) => {
    let countryItemContainer = document.getElementsByClassName(
      "countryItemContainer"
    );
    if (props.country.selected === true) {
      countryItemContainer[index]!.classList.remove(
        "countryItemContainerSelected"
      );
    } else {
      countryItemContainer[index]!.classList.add(
        "countryItemContainerSelected"
      );
    }
    props.toggleCountrySelected(index);
  };

  return (
    <ListGroup.Item
      as="li"
      className="countryItemContainer countryItemContainerSelected d-flex justify-content-between align-items-start"
      onClick={() => {
        toggleSelectedCountryAndListItemStyles(props.index);
      }}
    >
      <div className="countryItemTextContainer ms-2 me-auto">
        <h4 className="countryItemText">
          &nbsp;&nbsp;&nbsp;{props.country.name}
        </h4>
      </div>
      <div className="flagImageContainer">
        <img src={flagApiPath} alt=""></img>
      </div>
    </ListGroup.Item>
  );
};

export default CountryListItem;
