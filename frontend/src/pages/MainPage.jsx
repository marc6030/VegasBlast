import React from "react";
import MineBlast from "../assets/MineBlastThumb.png";
import Lightning from "../assets/LightningThumb.png";
import { Link } from "react-router-dom";
import "../styles/MainPage.css";

function MainPage() {
  return (
    <div className="main-container">
      <Link to="/MineBlast" className="Pic-button">
        <h1 className="main-title">Click for at spil MineBlast 💣!!</h1>
      </Link>

      <div className="image-row">
        <div className="image-container">
          <Link to="/MineBlast" className="Pic-button">
            <img src={MineBlast} alt="MineBlast Preview" />
          </Link>
        </div>
        <div className="image-container">
          <Link to="/MineBlastLightning" className="Pic-button">
            <img src={Lightning} alt="MineBlast Preview" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
