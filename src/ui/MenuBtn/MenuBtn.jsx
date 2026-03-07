import React from "react";
import PropTypes from "prop-types";
import "./MenuBtn.css";

const MenuBtn = ({ isOpen, toggleMenu }) => {
  return (
    <div
      className={`menu-toggle ${isOpen ? "opened" : "closed"}`}
      onClick={toggleMenu}
    >
      <div className="menu-toggle-icon">
        <div className="hamburger">
          <div className="menu-bar" data-position="top"></div>
          <div className="menu-bar" data-position="bottom"></div>
        </div>
      </div>
      <div className="menu-copy">
        <p>Menu</p>
      </div>
    </div>
  );
};

MenuBtn.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default MenuBtn;
