import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaBuilding, FaGlobe } from 'react-icons/fa';
import './ClientDetails.css';

interface Payment {
  paymentRef: string;
  amount: number;
  type_paiement: string;
  date_debut: Date;
  date_fin: Date;
}

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  Tel: string;
  Societe: string;
  Site_web: string;
  date_demande: Date;
  payments: Payment[];
}

interface ClientDetailsProps {
  user: User;
  onClose: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ user, onClose }) => {
  const [accountActive, setAccountActive] = useState<boolean>(true);
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState<boolean>(false);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [fetchError] = useState<string | null>(null); 

  useEffect(() => {
    fetchLastPayment();
  }, [user]);

  const fetchLastPayment = () => {
    const payments = user.payments;
    if (payments.length > 0) {
      setLastPayment(payments[payments.length - 1]);
    } else {
      setLastPayment(null);
    }
  };



  useEffect(() => {
    if (lastPayment) {
      const today = new Date();
      const paymentEndDate = new Date(lastPayment.date_fin);
      setAccountActive(paymentEndDate >= today);
    } else {
      setAccountActive(false);
    }
  }, [lastPayment]);

  const handleShowPaymentHistory = () => {
    setPaymentHistory(user.payments);
    setShowPaymentHistory(true);
  };

  const handleClosePaymentHistory = () => {
    setShowPaymentHistory(false);
  };

  return (
    <div className="clientDetails">
      {user ? (
        <div className="clientContainer">
          <div className="clientInfo">
            <div className="header">
              <h2>Détails du Client</h2>
              <div className="closeIcon" onClick={onClose}>
                <FaTimes size={30} className="redCloseIcon" />
              </div>
            </div>
            <div className="clientContent">
              <div className="details">
                <div className="detailItem">
                  <FaUser className="detailIcon" />
                  <div>
                    <span className="detailTitle">Nom :</span> {user.nom}
                  </div>
                </div>
                <div className="detailItem">
                  <FaUser className="detailIcon" />
                  <div>
                    <span className="detailTitle">Prénom :</span> {user.prenom}
                  </div>
                </div>
                <div className="detailItem">
                  <FaEnvelope className="detailIcon" />
                  <div>
                    <span className="detailTitle">Email :</span> {user.email}
                  </div>
                </div>
                <div className="detailItem">
                  <FaPhone className="detailIcon" />
                  <div>
                    <span className="detailTitle">Téléphone :</span> {user.Tel}
                  </div>
                </div>
                <div className="detailItem">
                  <FaBuilding className="detailIcon" />
                  <div>
                    <span className="detailTitle">Société :</span> {user.Societe}
                  </div>
                </div>
                <div className="detailItem">
                  <FaGlobe className="detailIcon" />
                  <div>
                    <span className="detailTitle">Site web :</span> {user.Site_web}
                  </div>
                </div>
                <div className="detailItem">
                  <div>
                  <div className="detailsContainer">
  <span className="detailTitle">Etat de compte :</span>
  <div className={`status ${accountActive ? 'active' : 'inactive'}`}>
    {accountActive ? 'Compte activé' : 'Compte désactivé'}
  </div>
</div>

                  </div>
                </div>
                <div className="detailItem">
                  <button className="historyButton" onClick={handleShowPaymentHistory}>
                    Historique des paiements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Chargement des détails du client...</p>
      )}

{showPaymentHistory && (
  <div className="paymentHistoryPopup">
    <div className="paymentHistoryContent">
      <ul>
        {paymentHistory.map((payment, index) => (
          <li key={index}>
                  <strong>Référence :</strong> {payment.paymentRef}<br />

            <strong>Montant :</strong> {payment.amount}<br />
            <strong>Type :</strong> {payment.type_paiement}<br />
            <strong>Date de début :</strong> {payment.date_debut instanceof Date ? payment.date_debut.toLocaleDateString() : payment.date_debut}<br />
            <strong>Date de fin :</strong> {payment.date_fin instanceof Date ? payment.date_fin.toLocaleDateString() : payment.date_fin}<br />
          </li>
        ))}
      </ul>
      <button onClick={handleClosePaymentHistory} className="fermerButton">Fermer</button>
    </div>
  </div>
)}


      {fetchError && <p>{fetchError}</p>} { }
    </div>
  );
};

export default ClientDetails;
