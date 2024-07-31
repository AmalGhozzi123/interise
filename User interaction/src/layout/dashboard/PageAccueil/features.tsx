import styles from "../dashboard.module.css";

const Features = () => {
  return (
    <section id="features" className={styles.features_section}>
      <article className={styles.intro_article}>
        <h2 className={styles.main_heading}>
          Prenez de l'avance avec la surveillance concurrentielles en temps réel
        </h2>
        <p className={styles.description}>
          Assurez une tarification compétitive, suivez les changements du marché et réagissez rapidement aux mouvements de vos concurrents.
          <br />
          Renforcez votre stratégie de tarification et maintenez un avantage concurrentiel sur un marché dynamique.
        </p>
      </article>

      <article className={styles.features_grid}>
        <div className={`${styles.feature_item} ${styles.bg_sky}`}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              Suivi automatisé des prix à portée de main
            </h2>
            <p className={styles.text}>
              Notre système automatisé rend le suivi des prix et des nouvelles offres des concurrents sans effort. 
                                 Réagissez aux changements du marché avec précision et rapidité.
            </p>
          </div>
          <div className={styles.image_container} >
            <img src='../images/Veille-informationnelle.png' alt="Kobodrop app frame" style={{width:'300px'}} />
          </div>
        </div>

        <div className={`${styles.feature_item} ${styles.bg_indigo}`}>
          <div className={styles.icon_container}>
            <img src='../images/check.png' alt="" />
          </div>
          <h2 className={styles.title}>
            Sécurité fiable des données
          </h2>
          <p className={styles.text}>
            Vos données sont sécurisées chez nous. 
            Expérimentez une surveillance fluide et sécurisée sans risque pour vos informations sensibles.
          </p>
        </div>

        <div className={`${styles.feature_item} ${styles.bg_orange}`}>
          <div className={styles.icon_container}>
            <img src='../images/coins.png' alt="" />
          </div>
          <h2 className={styles.title}>
            Améliorez l'efficacité opérationnelle
          </h2>
          <p className={styles.text}>
            Réduisez les coûts opérationnels avec la collecte automatisée de données. 
            Passez moins de temps sur les processus manuels et plus sur la prise de décision stratégique.
          </p>
        </div>

        <div className={`${styles.feature_item} ${styles.bg_sky}`}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              Adaptation dynamique au marché
            </h2>
            <p className={styles.text}>
              Adaptez-vous rapidement aux nouvelles stratégies de tarification et aux opportunités du marché avec nos outils de surveillance avancés. Restez toujours une longueur d'avance.
            </p>
          </div>
          <div className={styles.image_container}>
            <img src='../images/veille-marketing.png' alt="Frame displaying logos of various payment solutions" style={{width:'300px'}} />
          </div>
        </div>
      </article>
    </section>
  );
}

export default Features;
