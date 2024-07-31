import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './emailformpage.module.css';
import { DashboardComponents } from '@components';

const EmailFormPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { amount } = useParams(); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/payments/init-payment', { email, amount });
      
          let paymentLink = '';
          if (amount === '299') {
            paymentLink = 'https://api.preprod.konnect.network/SLelQUQ1Q';
          } else if (amount === '699') {
            paymentLink = 'https://api.preprod.konnect.network/Y5bZGU0so';
          } else if (amount === '999') {
            paymentLink = 'https://api.preprod.konnect.network/ybL68xb49';
          }
          window.location.href = paymentLink;
        } catch (error: any) {
          console.error('Erreur lors de la sauvegarde de l\'adresse e-mail :', error.response?.data);
      
          if (error.response?.data.message === "Vous devez envoyer une demande de démo avant de procéder au paiement.") {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Une erreur s\'est produite. Veuillez réessayer.');
          }
        } 
      };
      

    return (
        <>
            <div>
                <DashboardComponents.Navbar />
            </div>
            <h1>Saisissez votre adresse e-mail</h1>
            <div className={styles.SignUp}>
                <p>Pour continuer la procédure d'abonnement, saisissez votre adresse e-mail.</p>
                <form className={styles['sign-up-form']} onSubmit={handleSubmit}>
                    <div className={styles['input-container']}>
                        <FaEnvelope className={styles.icon} />
                        <input
                            type="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Email professionnel*"
                            required
                        />
                    </div>
                    <button type="submit" >
                      Envoyer
                    </button>
                    {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}
                </form>
            </div>
            <div>
                <DashboardComponents.Footer />
            </div>
        </>
    );
};

export default EmailFormPage;
