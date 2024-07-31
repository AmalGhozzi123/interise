import { DashboardComponents } from '@components';
import styles from './accueil.module.css';
import Features from './features';
export const PageAccueil = () => {
  return (
    <div >
      <DashboardComponents.Navbar/>
      <section className={styles.hero_section} >
        <div className="text-content">
          <h4 className={styles.main_heading} >
            Surveillance des Prix et Nouveautés Concurrentielles en Temps Réel
          </h4>
          <p className={styles.main_paragraph} >
            Transformez votre approche de la veille tarifaire.
            Notre plateforme automatisée utilise le web scraping et l'IA pour vous offrir une surveillance continue des prix
            et la détection des nouveaux produits chez vos concurrents. Réagissez rapidement aux changements de marché et gardez une 
            longueur d'avance dans un secteur hautement compétitif.
          </p>
        </div>
        <div className={styles.image_content}>
        <img src="../images/anim.gif"   
        className={styles.stat_image}/>
          <img
            className={styles.hero_image}
            src="../images/femme.png"
         
          />
              <img
            className={styles.phone_image}
            src="../images/mobile_app_dashboard.gif"
          />
        
        </div>
        

      </section>
      <Features></Features>

      <div className='Footer' style={{marginTop:'80px'}}>
      <DashboardComponents.Footer/>
      </div>
    </div>
  );
};
