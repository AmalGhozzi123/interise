//src/layout/dashboard/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardComponents } from "@components";
import {Dashboard } from "./Dashboard";
import Clients from "./Clients";
import Users from "./Users";
import Nouveaux_clients from "./Nouveaux_Clients"
import styles from "./dashboard.module.css";

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboard_container}>
      <DashboardComponents.SideBar />
      <div className={styles.dashboard_body}>
        <div className={styles.dashboard_body_container}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="nouveaux_clients" element={<Nouveaux_clients/>} />
            <Route path="users" element={<Users />} />
          </Routes>
        </div>
        <DashboardComponents.Footer />
      </div>
    </div>
  );
};

export default DashboardPage;
