import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import { ROUTES } from "@utils";
import { logout } from "../../../utils/auth"; 
export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);  
  const toggleSidebar = () => setIsOpen(!isOpen); 
  const path = useLocation().pathname;
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout(); 
    navigate(ROUTES.LOGIN); 
  };

  return (
    <div className="sidebar" style={{ width: isOpen ? '220px' : '60px' }}>
      <img
        src="/images/interface.png"
        alt="Toggle Sidebar"
        className="sidebar-toggle-icon"
        onClick={toggleSidebar}
      />
      <div className="sidebar-container">
        <div className="sidebar-logo-container">
          {isOpen && <img src="/images/logoo.png" alt="logo" />}
        </div>

        <div className="sidebar-items">
          <Link to={ROUTES.DASHBOARD} className={path === ROUTES.DASHBOARD ? "sidebar-item-active" : "sidebar-item"}>
            <img src="/images/trend.png" alt="Dashboard" className="sidebar-item-icon" />
            {isOpen && <span className="sidebar-item-label">Tableau de bord</span>}
          </Link>
          <Link to={ROUTES.USERS} className={path === ROUTES.USERS ? "sidebar-item-active" : "sidebar-item"}>
            <img src="/icons/demande.png" alt="Products" className="sidebar-item-icon" />
            {isOpen && <span className="sidebar-item-label">Gestion des demandes</span>}
          </Link>
          <Link to={ROUTES.NOUVEAUX_CLIENTS} className={path === ROUTES.NOUVEAUX_CLIENTS ? "sidebar-item-active" : "sidebar-item"}>
            <img src="/icons/user_icon.svg" alt="Products" className="sidebar-item-icon" />
            {isOpen && <span className="sidebar-item-label">Gestion des nouveaux client</span>}
          </Link>
          <Link to={ROUTES.CLIENTS} className={path === ROUTES.CLIENTS ? "sidebar-item-active" : "sidebar-item"}>
            <img src="/images/window-of-four-rounded-squares.png" alt="Products" className="sidebar-item-icon" />
            {isOpen && <span className="sidebar-item-label">Gestion des clients</span>}
          </Link>
          
        </div>
        
        <div className="sidebar-footer" onClick={handleLogout}>
          {isOpen && <span className="sidebar-item-label">Se déconnecter</span>}
          <img src="/images/icons8-se-déconnecter-96(-xxxhdpi).png" alt="Logout" className="sidebar-item-icon" />
        </div>
      </div>
    </div>
  );
};
