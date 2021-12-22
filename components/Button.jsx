import React, { useState, useEffect } from "react";
import styles from "./Button.module.css";

const Button = ({ children, onClick, disabled, type, style, ...props }) => {
  return (
    <>
      <button className={styles[style]}>{children || "label"}</button>
    </>
  );
};

export default Button;
