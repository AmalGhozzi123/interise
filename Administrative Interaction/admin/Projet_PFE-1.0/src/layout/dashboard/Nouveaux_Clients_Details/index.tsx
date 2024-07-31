import React, { useState } from 'react';
import { FaTimes, FaEdit, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBuilding, FaGlobe, FaCalendarAlt } from 'react-icons/fa';
import "./Nouveaux_client_details.css";

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
  payments: Payment[];
}

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
  onUpdate: (user: User) => Promise<void>;
}

const Nouveaux_Clients_Details: React.FC<UserDetailsProps> = ({ user, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [editedPassword, setEditedPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPassword(e.target.value);
  };

  const handleSave = async () => {
    if (!editedPassword) {
      setPasswordError('Le champ du mot de passe ne peut pas être vide.');
      return;
    }

    const updatedUser = { ...editedUser, motDePasse: editedPassword };
    await onUpdate(updatedUser);
    setIsEditing(false);
    onClose();
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  return (
    <div className="userDetails">
      {user ? (
        <div className="userContainer">
          <div className="userInfo">
            <div className="header">
              <h2>Détails du nouveau client</h2>
              <div className="closeIcon" onClick={onClose}>
                <FaTimes size={30} className="redCloseIcon"/>
              </div>
            </div>
            <div className="userContent">
              <div className="details">
                {isEditing ? (
                  <div className="editSection">
                    <button onClick={handleBack} className='iconBack'><FaArrowLeft /></button>
                    <label>
                      <b>Nouveau mot de passe:</b>
                      {passwordError && <p className="error">{passwordError}</p>}
                      <input
                        type="password"
                        value={editedPassword}
                        onChange={handlePasswordChange}
                      />
                    </label>
                    <button onClick={handleSave}>Enregistrer</button>
                  </div>
                ) : (
                  <>
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
                      <span className="detailTitle">Site web :</span> {user.Site_web}
                    </div>
                    <div className="detailItem">
                      <h3>Détails des paiements :</h3>
                      {user.payments.map((payment, index) => (
                        <div key={index}>
                          <p><b>Référence de paiement :</b> {payment.paymentRef}</p>
                          <p><b>Montant :</b> {payment.amount}</p>
                          <p><b>Type de paiement :</b> {payment.type_paiement}</p>
                          <p><b>Date de début :</b> {new Date(payment.date_debut).toLocaleDateString()}</p>
                          <p><b>Date de fin :</b> {new Date(payment.date_fin).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                    <button className="editButton" onClick={() => setIsEditing(true)} style={{fontFamily:'Gerogia,serif'}}>
                      <FaEdit /> Ajouter un mot de passe
                    </button>
                  </>
                )}
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

export default Nouveaux_Clients_Details;
