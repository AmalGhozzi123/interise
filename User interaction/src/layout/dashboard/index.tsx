import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardComponents } from "@components";

import styles from "./dashboard.module.css";
import { Apropos } from "./Apropos";

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboard_container}>
      <div className={styles.dashboard_body}>
        <div className={styles.dashboard_body_container}>
          <Routes>
     
            <Route path="Apropos" element={<Apropos />} />
            



          </Routes>
        </div>
        <DashboardComponents.Footer />
      </div>
    </div>
  );
};

export default DashboardPage;
