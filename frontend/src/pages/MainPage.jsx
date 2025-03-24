import React from "react";
import MineBlastPic from "../assets/MineBlastPic.png";
import { Link } from "react-router-dom";
import "../styles/MainPage.css"; 

function MainPage() {
  return (
    <div className="main-container">
      <h1 className="main-title">MineBlast 💣</h1>
      <div className="image-container">
      <Link to="/MineBlast" className="Pic-button">
        <img src={MineBlastPic} alt="MineBlast Preview" />
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
