import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loadingContainer text-center">
      <div className="spinner-border" role="status">
        <span className="sr-only"></span>
      </div>
    </div>
  );
};

export default Loading;
