import styles from './footer.module.css';
import { Link} from "react-router-dom";

export const Footer = () => {
  return (
    <section className={styles.footerSection}>
      <div className={styles.footerContainer}>
        <div className={styles.footerRow}>
          <div>
            <img
              className={styles.logoImage}
              src='../images/logoo.png'  
              alt="Logo de l'entreprise"
            />
         <p className={styles.highlighted_block}>
  Maîtrisez votre présence digitale avec notre plateforme de veille.
  Notre système automatisé rend le suivi des prix et des nouvelles offres des concurrents sans effort. 
  Réagissez aux changements du marché avec précision et rapidité. 
</p>

          </div>
          <div className={styles.footerColumn}>
            <p className={styles.footerTitle}>Menu</p>
            <li><Link to="/" className={styles.navLink}>Accueil</Link></li>
            <li><Link to="/Apropos" className={styles.navLink}>À propos</Link></li>
            <li><Link to="/PaymentPage" className={styles.navLink}>Tarifs</Link></li>
          </div>
          <div className={styles.footerColumn}>
            <p className={styles.footerTitle}>Contactez-nous</p>
            <a href="#"><img src='../icons/adresse_icon.png' />78, Rue des minéraux 8603 Z.I de la Charguia 1 2035 Tunis - Tunisie</a>
            <a href="#"><img src='../icons/phone_icon.png'/>(+216) 71 205 105</a>
            <a href="#"> <img src='../icons/courrier_icon.png' />contact@interise.tn</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>
            Copyright © 2024 interise Tous droits réservés.
          </p>
          <div className={styles.socialIcons}>
            <a href="https://twitter.com/tdiscounttn" target="_blank" rel="noopener noreferrer">
              <img src='../icons/twitter_icon.png' alt="Logo Twitter" />
            </a>
            <a href="https://www.facebook.com/tdiscount.tn" target="_blank" rel="noopener noreferrer">
              <img src='../icons/facebook_icon.png' alt="Logo Facebook" />
            </a>
            <a href="https://www.linkedin.com/company/tdiscount/" target="_blank" rel="noopener noreferrer">
              <img src='../icons/linkedin_icon.png' alt="Logo LinkedIn" />
            </a>
            <a href="https://www.instagram.com/Tdiscount_tn/" target="_blank" rel="noopener noreferrer">
              <img src='../icons/instagram_icon.png' alt="Logo Instagram" />
            </a>

            
          </div>
        </div>
      </div>
    </section>
  );
};
