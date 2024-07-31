import React, { useState, FormEvent } from "react";
import axios from 'axios';
import { Input } from "@components";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from 'react-icons/fa';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/loginAdmin", {
        email,
        motdepasse: password,
      });

      localStorage.setItem("accessToken", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Email et/ou mot de passe incorrect(s)!!!");
    }
    setDialogVisible(true); 
  };
  


  const isInputValid = () => {
    return email.trim() !== "" && password.trim() !== "";
  };



    return (
      <div className={`${styles.login_container} login-page-inputs`}>
        <img src="/images/logoo.png" className={styles.logo} alt="Logo" />
        <div className={styles.login_form}>
          <h1>Connexion</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.input_container}>
              <FaEnvelope className={styles.icon} />
              <Input
                type="text"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.input_container}>
              <FaLock className={styles.icon} />
              <Input
                type="password"
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className={isInputValid() ? styles.enabled_button : styles.disabled_button} 
              disabled={!isInputValid()}
            >
              Se connecter
            </button>
          </form>
        </div>
        {dialogVisible && (
          <div className={styles.dialog_overlay} onClick={() => setDialogVisible(false)}>
            <div className={styles.dialog}>
              <span className={styles.close_button} onClick={() => setDialogVisible(false)}><b>×</b></span>
              <p className={styles.error_message}>{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  };