import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./Contact.css";
import { DashboardComponents } from '@components';
import { ROUTES } from "@utils";
const axios = require('axios');

interface FormState {
    nom: string;
    prenom: string;
    email: string;
    Tel: string;
    Societe: string;
    Site_web: string;
}

const Contact = () => {
    const [formData, setFormData] = useState<FormState>({
        nom: '',
        prenom: '',
        email: '',
        Tel: '',
        Societe: '',
        Site_web: '',
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isValid = Object.values(formData).every(x => x !== '');
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (formData.Tel.length !== 8) {
            setErrorMessage('Le numéro de téléphone doit comporter 8 chiffres!');
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setErrorMessage('Veuillez entrer une adresse e-mail valide!');
            return false;
        }

        const websitePattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        if (!websitePattern.test(formData.Site_web)) {
            setErrorMessage('Veuillez entrer une URL de site Web valide!');
            return false;
        }

        return true;
    };

    const checkEmailExists = async (email:string) => {
        try {
            const response = await axios.get(`https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${email}`);
            const data = response.data;
            if (data.status === 'Valid' || data.status === 'Catch-All') {
                return true; 
            } else {
                return false; 
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'email :', error);
            return false;
        }
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let errorMessage = '';
        let isFormValid = true;
    
        if (formData.Tel.length !== 8) {
            errorMessage = 'Le numéro de téléphone doit comporter 8 chiffres!';
            isFormValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errorMessage = 'Veuillez entrer une adresse e-mail valide!';
            isFormValid = false;
        } else if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(formData.Site_web)) {
            errorMessage = 'Veuillez entrer une URL de site Web valide!';
            isFormValid = false;
        } else if (isBlockedEmail(formData.email)) {
            errorMessage = 'Veuillez entrer une adresse e-mail professionnelle valide!';
            isFormValid = false;
        }
    
        if (!isFormValid) { 
            setErrorMessage(errorMessage);
            return;
        }
    
      
        try {
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists === true) {
                errorMessage = 'Cette adresse email a déjà été utilisée !';
            } else if (emailExists === false) {
                const response = await fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                if (response.ok) {
                    setShowDialog(true);
                } else {
                    const data = await response.json();
                    errorMessage = data.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
                }
            } else {
                errorMessage = 'Erreur lors de la vérification de l\'email. Veuillez réessayer.';
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'email ou de l\'inscription :', error);
            errorMessage = 'Erreur lors de la vérification de l\'email ou de l\'inscription. Veuillez réessayer.';
        } 
    
        setErrorMessage(errorMessage);
    };

    const isBlockedEmail = (email: string): boolean => {
        const blockedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com']; // Ajoutez d'autres domaines au besoin
        const domain = email.split('@')[1];
        return blockedDomains.includes(domain);
    };
    
    const handleCloseDialog = () => {
        setShowDialog(false);
        navigate(ROUTES.LOGIN);
    };

    return (
        <div className="SignUp">
            <DashboardComponents.Navbar />
            <div className="header">
                <div className="title"><h1>Parlez avec un expert de interise</h1></div>
            </div>
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="input-container">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Nom*"
                            required
                        />
                        {formData.nom === '' && <span className="required-field"></span>}
                    </div>
                    <div className="input-container">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            placeholder="Prénom*"
                            required
                        />
                        {formData.prenom === '' && <span className="required-field"></span>}
                    </div>
                    <div className="input-container">
                        <FaEnvelope className="icon" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email professionnel*"
                            required
                        />
                        {formData.email === '' && <span className="required-field"></span>}
                    </div>
                    <div className="input-container">
                        <FaPhone className="icon" />
                        <input
                            type="text"
                            name="Tel"
                            value={formData.Tel}
                            onChange={handleChange}
                            placeholder="Numéro de téléphone*"
                            required
                        />
                        {formData.Tel === '' && <span className="required-field"></span>}
                    </div>
                    <div className="input-container">
                        <FaBuilding className="icon" />
                        <input
                            type="text"
                            name="Societe"
                            value={formData.Societe}
                            onChange={handleChange}
                            placeholder="Société*"
                            required
                        />
                        {formData.Societe === '' && <span className="required-field"></span>}
                    </div>
                    <div className="input-container">
                        <FaGlobe className="icon" />
                        <input
                            type="text"
                            name="Site_web"
                            value={formData.Site_web}
                            onChange={handleChange}
                            placeholder="Site web*"
                            required
                        />
                        {formData.Site_web === '' && <span className="required-field"></span>}
                    </div>
                </div>
                <button type="submit" >
                    Envoyer
                </button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
            {showDialog && (
                <div className="dialog">
                    <h2>Votre demande de démonstration a été envoyée avec succès !</h2>
                    <p>Votre demande est actuellement en cours de révision. Vous serez contacté prochainement par mail.</p>
                    <button onClick={handleCloseDialog}>Fermer</button>
                </div>
            )}
            <img src="../images/contact.png" className="Contact" alt="Contact" />
            <div className='Footer' style={{ marginTop: '80px' }}>
                <DashboardComponents.Footer />
            </div>
        </div>
    );
};

export default Contact;

