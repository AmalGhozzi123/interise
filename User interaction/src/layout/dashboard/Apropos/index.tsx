import { DashboardComponents } from '@components';
import styles from './Apropos.module.css';

export const Apropos = () => {
  return (
    <>
      <div>
        <DashboardComponents.Navbar />
      </div>
      <div className={styles.aboutContainer}>
        <section className={styles.heroSection}>
          <img src="../images/active-man-thinking.png" alt="think_image" className={styles.think_image} />
          <div className={styles.heroText}>
            <h1>Qui sommes-nous ?</h1>
            <p>
  Bienvenue sur interise, 
  votre partenaire technologique dédié à transformer la manière dont les entreprises comprennent et 
  réagissent aux dynamiques de marché. 
  Spécialisés dans la veille stratégique du web et des réseaux sociaux, nous utilisons des technologies de pointe pour fournir des insights précis et en temps réel qui alimentent les stratégies de croissance et d'innovation. Chez Interise.io, nous sommes passionnés par l'aide que nous apportons aux organisations pour qu'elles restent en avance sur la concurrence, anticipent les changements du marché et répondent avec agilité aux nouvelles opportunités et défis. Que vous cherchiez à affiner votre stratégie de tarification, à surveiller vos concurrents, ou simplement à avoir une meilleure compréhension du paysage numérique, notre plateforme est conçue pour vous offrir un avantage compétitif durable.
</p>
          </div>
        </section>
        <section className={styles.challengeSolutionSection}>
          <div className={styles.challengeText}>
            <h2><img src="../images/question.png" className={styles.question_image}/>  Défis Stratégiques</h2>
            <p>
              Dans le contexte actuel d'un marché global hautement compétitif, les entreprises doivent constamment surveiller et réagir aux stratégies de prix de leurs concurrents. La méthode traditionnelle, manuelle et réactive, expose les entreprises à des risques élevés d'inexactitudes, de retards et d'opportunités manquées. Cela compromet leur capacité à prendre des décisions stratégiques éclairées en temps opportun.
            </p>
          </div>
          <div className={styles.solutionText}>
            <h2>  <img src="../images/solution.png" className={styles.solution_image}/> Notre Approche Innovante</h2>
            <p>
             
              Notre plateforme <b>interise</b>, révolutionne la surveillance des marchés en automatisant la collecte et l'analyse des données. Utilisant des technologies avancées de web scraping et d'intelligence artificielle, notre outil fournit une veille compétitive en temps réel. Cela permet aux entreprises non seulement de suivre les changements de prix instantanément mais aussi d'anticiper les tendances du marché et d'ajuster dynamiquement leurs propres stratégies de prix et de marketing.
            </p>
            <p>
              Les fonctionnalités clés incluent des tableaux de bord , des alertes de prix en temps réel et des rapports analytiques profonds, offrant ainsi une vue à 360 degrés de l'environnement concurrentiel. En conséquence, nos clients peuvent rester en avance sur leurs concurrents et optimiser leurs performances sur le marché.
            </p>
          </div>
        </section>
        <section className={styles.valuesSection}>
  <h2 className={styles.piliers}>Les Piliers de Notre Innovation</h2>
  <div className={styles.valuesGrid}>
    <div className={styles.valueItem}>
      <img src="../images/Automatisation-des-processus.png" alt="Efficacité" />
      <h3>Efficacité Maximisée</h3>
      <p>En remplaçant les méthodes manuelles par notre système automatisé, nous augmentons la capacité de nos clients à suivre les prix en temps réel, réduisant ainsi les erreurs humaines et les retards qui peuvent coûter cher dans un marché compétitif.</p>
    </div>
    <div className={styles.valueItem}>
      <img src="../images/graph.png" alt="Scalabilité" />
      <h3>Scalabilité Améliorée</h3>
      <p>Notre solution évolutive permet une surveillance extensive des concurrents et des produits, surmontant les limites des opérations manuelles et offrant une couverture plus large et plus précise.</p>
    </div>
    <div className={styles.valueItem}>
      <img src="../images/analyse-commerciale.png" alt="Intelligence de Marché" />
      <h3>Intelligence de Marché Avancée</h3>
      <p>Grâce à des techniques avancées de web scraping et d'analyse de données, nous fournissons des insights détaillés qui permettent à nos clients de prendre des décisions stratégiques éclairées, basées sur les données récentes et pertinentes.</p>
    </div>
  </div>
</section>

       
      </div>
      <div>
      <DashboardComponents.Footer />

      </div>
    </>
  );
};
