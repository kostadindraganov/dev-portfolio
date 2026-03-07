"use client";
import "./CTAWindow.css";
import PropTypes from "prop-types";

import Copy from "../Copy/Copy";

const CTAWindow = ({ img, header, callout, description }) => {
  return (
    <section className="cta-window">
      <div className="container">
        <div className="cta-window-img-wrapper">
          <img src={img} alt="" />
        </div>
        <div className="cta-window-img-overlay"></div>
        <div className="cta-window-header">
          <Copy delay={0.1}>
            <h1>{header}</h1>
          </Copy>
        </div>
        <div className="cta-window-footer">
          <div className="cta-window-callout">
            <Copy delay={0.1}>
              <h3>{callout}</h3>
            </Copy>
          </div>
          <div className="cta-window-description">
            <Copy delay={0.1}>
              <p>{description}</p>
            </Copy>
          </div>
        </div>
      </div>
    </section>
  );
};

CTAWindow.propTypes = {
  img: PropTypes.string,
  header: PropTypes.string,
  callout: PropTypes.string,
  description: PropTypes.string,
};

export default CTAWindow;
