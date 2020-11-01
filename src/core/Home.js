import React from "react";
import Card from "./Card";
import "../styles.css";
import Base from "./Base";

export default function Home() {
  return (
    <Base title="Home Page" description="Welcome to T-Shirt store">
      <div className="row text-center">
        <div className="col-4">
          <Card />
        </div>
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
      </div>
    </Base>
  );
}
