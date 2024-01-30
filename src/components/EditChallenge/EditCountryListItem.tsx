import React from "react";
import "./EditChallenge.css";
import { ListGroup } from "react-bootstrap";

const EditCountryListItem = (props: {
  index: number;
  country: {
    countryCode: string;
    name: string;
    selected: boolean;
    completed: boolean;
    editCountryClasses: string;
  };
  toggleCountrySelected: Function;
  toggleCountryCompleted: Function;
}) => {
  const flagApiPath =
    "https://flagsapi.com/" + props.country.countryCode + "/shiny/64.png";

  const toggleSelectedCountryAndListItemStyles = (index: number) => {
    let editCountryItemContainer = document.getElementsByClassName(
      "editCountryItemContainer"
    );
    let flagImage = document.getElementsByClassName("flagImage")[
      index
    ] as HTMLElement;
    if (props.country.selected === true) {
      editCountryItemContainer[index]!.classList.remove(
        "editCountryItemContainerSelected"
      );
      if (props.country.completed === true) {
        editCountryItemContainer[index]!.classList.remove(
          "editCountryItemContainerCompleted"
        );
      }
      flagImage.style["opacity"] = "50%";
    } else {
      if (props.country.completed === true) {
        editCountryItemContainer[index]!.classList.add(
          "editCountryItemContainerCompleted"
        );
      }
      editCountryItemContainer[index]!.classList.add(
        "editCountryItemContainerSelected"
      );
      flagImage.style["opacity"] = "100%";
    }
    props.toggleCountrySelected(index);
  };

  const toggleCompletedCountryAndListItemStyles = (
    event: React.MouseEvent<HTMLHeadingElement>,
    index: number
  ) => {
    let editCountryItemContainer = document.getElementsByClassName(
      "editCountryItemContainer"
    );
    if (props.country.completed === true) {
      editCountryItemContainer[index]!.classList.remove(
        "editCountryItemContainerCompleted"
      );
    } else {
      editCountryItemContainer[index]!.classList.add(
        "editCountryItemContainerCompleted"
      );
    }
    props.toggleCountryCompleted(index);
    event.stopPropagation();
  };

  return (
    <ListGroup.Item
      as="li"
      className={
        props.country.editCountryClasses +
        "d-flex justify-content-between align-items-start"
      }
      onClick={() => {
        toggleSelectedCountryAndListItemStyles(props.index);
      }}
    >
      <div className="editCountryItemTextContainer ms-2 me-auto">
        <h4 className="editCountryItemText">{props.country.name}</h4>
        {props.country.selected === true ? (
          <div>
            <h4
              className="completeIncompleteText"
              onClick={(event) => {
                toggleCompletedCountryAndListItemStyles(event, props.index);
              }}
            >
              {props.country.completed === true ? "Incomplete" : "Complete"}
            </h4>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flagImageContainer">
        <img className="flagImage" src={flagApiPath} alt=""></img>
      </div>
    </ListGroup.Item>
  );
};

export default EditCountryListItem;
