import { Link } from "react-router-dom";
import styles from './navbar.module.css'; 


export const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/images/logoo.png" alt="Logo" />
      </div>
      <ul className={styles.navLinks}>
        <li><Link to="/" className={styles.navLink}>Accueil</Link></li>
        <li><Link to="/Apropos" className={styles.navLink}>À Propos</Link></li>
        <li><Link to="/PaymentPage" className={styles.navLink}>Tarifs</Link></li>
      </ul>
      <button className={styles.demoButton}> <Link to="/Contact">Demander une démo</Link></button>
    </div>
  );
};


