import React from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaBuilding, FaGlobe, FaCalendarAlt } from 'react-icons/fa';
import "./Userdetails.css";

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  Tel: string;
  Societe: string;
  Site_web: string;
  motDePasse?: string;
  date_demande: Date;
  payments: Payment[];}
  
  interface Payment {
    paymentRef: string;
    amount: number;
    type_paiement: string;
    date_debut: Date;
    date_fin: Date;
  }


interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
  return (
    <div className="userDetails">
      {user ? (
        <div className="userContainer">
          <div className="userInfo">
            <div className="header">
              <h2>Détails de la demande de démonstration</h2>
              <div className="closeIcon" onClick={onClose}>
                <FaTimes size={30}  className="redCloseIcon" />
              </div>
            </div>
            <div className="userContent">
              <div className="detailItem">
                <FaUser className="detailIcon" />
                <span className="detailTitle">Nom :</span> {user.nom}
              </div>
              <div className="detailItem">
                <FaUser className="detailIcon" />
                <span className="detailTitle">Prénom :</span> {user.prenom}
              </div>
              <div className="detailItem">
                <FaEnvelope className="detailIcon" />
                <span className="detailTitle">Email :</span> {user.email}
              </div>
              <div className="detailItem">
                <FaPhone className="detailIcon" />
                <span className="detailTitle">Téléphone :</span> {user.Tel}
              </div>
              <div className="detailItem">
                <FaBuilding className="detailIcon" />
                <span className="detailTitle">Société :</span> {user.Societe}
              </div>
              <div className="detailItem">
                <FaCalendarAlt className="detailIcon" />
                <span className="detailTitle">Date demande :</span> {new Date(user.date_demande).toLocaleDateString()}
              </div>
              <div className="detailItem">
                <FaGlobe className="detailIcon" />
                <span className="detailTitle">Site web :</span> <a href={user.Site_web} target="_blank" rel="noopener noreferrer" style={{color:'#041172'}}>{user.Site_web}</a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Chargement des détails de l'utilisateur...</p>
      )}
    </div>
  );
};

export default UserDetails;
