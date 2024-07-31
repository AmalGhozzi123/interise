import React from "react";

import styles from "./footer.module.css";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className={styles.dashboard_footer}>
      <span>
        ©{year}  developed by <a>interise </a>
      </span>
    </div>
  );
};
