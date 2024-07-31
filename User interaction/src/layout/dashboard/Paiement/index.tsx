import styles from './PaymentPage.module.css';
import { DashboardComponents } from '@components';
import { Link } from "react-router-dom";

const PaymentPage = () => {
  return (
    <>
      <div>
        <DashboardComponents.Navbar />
      </div>
      <div className={styles.paymentContainer}>
        <h1>Choisissez l'offre adaptée à vos besoins</h1>
        <div className={styles.planBox}>
          <Link to="/EmailFormPage/299" className={styles.planLink}>
            <div className={styles.plan}>
              <h2>299 DT / mois</h2>
              <p>Accédez à toutes les fonctionnalités avec un paiement mensuel.</p>
              <button className={styles.ctaButton}>S'abonner</button>
            </div>
          </Link>
          <Link to="/EmailFormPage/699" className={styles.planLink}>
            <div className={styles.plan}>
              <h2>699 DT / semestre</h2>
              <p>Profitez d'une réduction en choisissant un abonnement semestriel.</p>
              <button className={styles.ctaButton}>S'abonner</button>
            </div>
          </Link>
          <Link to="/EmailFormPage/999" className={styles.planLink}>
            <div className={styles.plan}>
              <h2>999 DT / an</h2>
              <p>Économisez encore plus avec un abonnement annuel.</p>
              <button className={styles.ctaButton}>S'abonner</button>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <DashboardComponents.Footer />
      </div>
    </>
  );
};

export default PaymentPage;
