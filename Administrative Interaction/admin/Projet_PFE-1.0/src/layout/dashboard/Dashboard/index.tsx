import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Chart from "chart.js/auto";
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { DashboardComponents } from "@components";
import { ROUTES } from "@utils";
import styles from "../dashboard.module.css";
import './dashboard.css';
Chart.defaults.font.family = "Georgia, serif";


interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  Tel: string;
  Societe: string;
  Site_web: string;
  motDePasse?: string;
  date_demande: Date;
  payments: Payment[];
}

interface Payment {
  paymentRef: string;
  amount: number;
  type_paiement: string;
  date_debut: Date;
  date_fin: Date;
}

export const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [showDownloadButtons] = useState(true);
  const [activeAccounts, setActiveAccounts] = useState<number>(0);
  const [inactiveAccounts, setInactiveAccounts] = useState<number>(0);
  const [nouveauxClients, setNouveauxClients] = useState<User[]>([]);
  const [requestsPeDay, setRequestsPerDay] = useState<number[]>([]);
  
  const clientsChartRef = useRef<HTMLCanvasElement | null>(null);
  const activeAccountsChartRef = useRef<HTMLCanvasElement | null>(null);
  const requestsChartRef = useRef<HTMLCanvasElement | null>(null);
  const paymentsChartRef = useRef<HTMLCanvasElement | null>(null);
  const societeChartRef = useRef<HTMLCanvasElement | null>(null);
  const paymentsOverTimeChartRef = useRef<HTMLCanvasElement | null>(null);
  

  const today = new Date();

  useEffect(() => {
    fetchUsers();
    fetchTotalClients();
    fetchNouveauxClients();
  }, []); 
  useEffect(() => {
    if (users.length > 0) {
      fetchRequestsPerWeek();
    }
  }, [users]);


 

  const countRequestsForDate = (dateString: string) => {
    return users.filter((user) => {
      const requestDate = user.date_demande instanceof Date ? user.date_demande : new Date(user.date_demande);
      return requestDate.toLocaleDateString("fr-FR") === dateString;
    }).length;
  };
  

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
      updateAccountStatus(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTotalClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setTotalClients(response.data.length);
      updateAccountStatus(response.data);
    } catch (error) {
      console.error("Error fetching total clients:", error);
    }
  };

  const fetchNouveauxClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/nouveaux-clients");
      setNouveauxClients(response.data);
    } catch (error) {
      console.error("Error fetching nouveaux clients:", error);
    }
  };

  const updateAccountStatus = (clients: User[]) => {
    const activeCount = countActiveAccounts(clients);
    const inactiveCount = clients.length - activeCount;
    setActiveAccounts(activeCount);
    setInactiveAccounts(inactiveCount);
  };

  const countActiveAccounts = (clients: User[]) => {
    const today = new Date();
    return clients.filter((client) => {
      const lastPayment = client.payments.length > 0 ? client.payments[client.payments.length - 1] : null;
      if (lastPayment) {
        const paymentEndDate = new Date(lastPayment.date_fin);
        return paymentEndDate >= today;
      }
      return false;
    }).length;
  };

  const countNewRequestsToday = () => {
    return users.filter((user) => {
      if (user.date_demande instanceof Date) {
        return user.date_demande.toLocaleDateString("fr-FR") === today.toLocaleDateString("fr-FR");
      } else if (typeof user.date_demande === "string") {
        const requestDate = new Date(user.date_demande);
        return requestDate.toLocaleDateString("fr-FR") === today.toLocaleDateString("fr-FR");
      }
      return false;
    }).length;
  };

  const countNewClientsToday = () => {
    return nouveauxClients.length;
  };

  const getCurrentDate = () => {
    return today.toLocaleDateString("fr-FR");
  };
  const createChart = (labels: string[], data: number[]) => {
    if (requestsChartRef.current) {
      const ctx = requestsChartRef.current.getContext("2d");
      if (ctx) {
        if (Chart.getChart(ctx)) {
          Chart.getChart(ctx)?.destroy();
        }
        new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Nombre de demandes de démonstration par jour",
                data: data,
                backgroundColor: "#143d8f",
                borderColor: "#48a6d9",
                borderWidth: 3,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: 'Nombre des demandes de démonstration par jour'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Jour",
                },
                ticks: {
                  display: true,
                  
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Nombre de demandes",
                },
                type: 'linear',
                beginAtZero: true,
                suggestedMin: 0,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          },
        });
      }
    }
  };
  
  // Appel de la fonction avec des arguments
  const fetchRequestsPerWeek = async () => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); 
      const endDate = new Date();
  
      const requestsByDay: { [key: string]: number } = {};
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toLocaleDateString("fr-FR");
        const requestsCount = countRequestsForDate(formattedDate);
        requestsByDay[formattedDate] = requestsCount;
      }
  
      const formattedDates = Object.keys(requestsByDay); // Tableau de dates formatées
      setRequestsPerDay(formattedDates.map(date => requestsByDay[date]));
      createChart(formattedDates, Object.values(requestsByDay)); 
    } catch (error) {
      console.error("Error fetching requests per week:", error);
    }
  };
  useEffect(() => {
    createSocietePaymentsChart();
  }, [users]);
  
  const createSocietePaymentsChart = () => {
    if (societeChartRef.current) {
      const ctx = societeChartRef.current.getContext("2d");
      if (ctx) {
        const societes = [...new Set(users.map(user => user.Societe))];
        const societePaymentCounts = societes.map(societe => 
          users.filter(user => user.Societe === societe && user.payments.length > 0).length);
  
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: societes,
            datasets: [
              {
                label: "Nombre de Clients avec Paiement par Société",
                data: societePaymentCounts,
                backgroundColor: "#48a6d9",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: 'Nombre de Clients avec Paiement par Société'
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Société",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Nombre de Clients",
                },
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          },
        });
      }
    }
  };
  
  
useEffect(() => {
  createClientsChart();
}, [totalClients, nouveauxClients,users]);

const createClientsChart = () => {
  if (clientsChartRef.current) {
    const ctx = clientsChartRef.current.getContext("2d");
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Clients", "Nouveaux Clients", "Demandes de démonstration"],
          datasets: [
            {
              label: "Clients",
              data: [totalClients, 0, 0],
              backgroundColor: "#143d8f",
              borderWidth: 1,
            },
            {
              label: "Nouveaux Clients",
              data: [0, nouveauxClients.length, 0],
              backgroundColor: "#48a6d9",
              borderWidth: 1,
            },
            {
              label: "Demandes de démonstration",
              data: [0, 0, users.length],
              backgroundColor: "#6b80bd",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: 'Répartition des utilisateurs'
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Type d'utilisateur",
              },
            },
            y: {
              title: {
                display: true,
                text: "Nombre d'utilisateurs",
              },
              type: 'linear',
              beginAtZero: true,
              suggestedMin: 0,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  }
};


const downloadChartAsImage = (chartId: string, imageFormat: 'png' | 'jpeg' = 'png') => {
  const canvas = document.getElementById(chartId) as HTMLCanvasElement;
  if (canvas) {
    const imageURI = canvas.toDataURL(`image/${imageFormat}`);
    const link = document.createElement('a');
    link.download = `${chartId}.${imageFormat}`;
    link.href = imageURI;
    link.click();
  }
};

const downloadChartAsPDF = (chartId: string, title: string) => {
  const canvas = document.getElementById(chartId) as HTMLCanvasElement;
  if (canvas) {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
    });
    pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
    pdf.text(title, 10, 10);
    pdf.save(`${title}.pdf`);
  }
};




useEffect(() => {
  createSocieteChart();
}, [users]);

const createSocieteChart = () => {
  if (societeChartRef.current) {
    const ctx = societeChartRef.current.getContext("2d");
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      const societes = [...new Set(users.map(user => user.Societe))];
      const societeCounts = societes.map(societe => 
        users.filter(user => user.Societe === societe).length);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: societes,
          datasets: [
            {
              label: "Utilisateurs par Société",
              data: societeCounts,
              backgroundColor: "#48a6d9",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: 'Répartition des Utilisateurs par Société'
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Société",
              },
            },
            y: {
              title: {
                display: true,
                text: "Nombre d'Utilisateurs",
              },
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  }
};
const createPaymentsOverTimeChart = () => {
  if (paymentsOverTimeChartRef.current) {
    const ctx = paymentsOverTimeChartRef.current.getContext("2d");
    if (ctx) {
      const paymentTypes = ["Mensuel", "Semestriel", "Annuel"]; // Types de paiement
      const paymentCounts = paymentTypes.map(type =>
        users.reduce((total, user) => total + user.payments.filter(payment => payment.type_paiement === type).length, 0)
      );

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: paymentTypes,
          datasets: [
            {
              label: "Nombre de paiements par type",
              data: paymentCounts,
              backgroundColor: ["#48a6d9", "#143d8f", "#6b80bd"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: 'Répartition des paiements par type'
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Type de Paiement",
              },
            },
            y: {
              title: {
                display: true,
                text: "Nombre de Paiements",
              },
              type: 'linear',
              beginAtZero: true,
              suggestedMin: 0,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  }
};




useEffect(() => {
  if (activeAccountsChartRef.current) {
    const ctx = activeAccountsChartRef.current.getContext("2d");
    if (ctx) {
      if (Chart.getChart(ctx)) {
        Chart.getChart(ctx)?.destroy();
      }
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Compte actif", "Compte inactif"],
          datasets: [
            {
              label: "Statut des comptes",
              data: [activeAccounts, inactiveAccounts],
              backgroundColor: ["#6b80bd", "#143d8f"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: 'Statut des comptes'
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Type de Compte",
              },
            },
            y: {
              title: {
                display: true,
                text: "Nombre de Comptes",
              },
              type: 'linear',
              beginAtZero: true,
              suggestedMin: 0,
              ticks: {
                stepSize: 1, 
              },
            },
          },
        },
      });
    }
  }
}, [activeAccounts, inactiveAccounts]);
  
  

  return (
    <div className={styles.dashboard_content}>
      <div className={styles.dashboard_content_container}>
        <div className={styles.dashboard_cards}>
          <DashboardComponents.StatCard
            title={"Tous les demandes de démonstration"}
            link={ROUTES.USERS}
            value={users.length}
            icon="/icons/new.svg"
          />
          <DashboardComponents.StatCard
            title={`Nouveaux demandes de démonstration (${getCurrentDate()})`}
            link={ROUTES.USERS}
            value={countNewRequestsToday()}
            icon="/icons/new.svg"
          />
          <DashboardComponents.StatCard
            title={`Nouveaux Client (${getCurrentDate()})`}
            link={ROUTES.NOUVEAUX_CLIENTS}
            value={countNewClientsToday()}
            icon="/icons/new.svg"
          />
          <DashboardComponents.StatCard
            title="Tous les clients"
            link={ROUTES.CLIENTS}
            value={totalClients}
            icon="/icons/product.svg"
          />
          <DashboardComponents.StatCard
            title="Compte désactivé"
            link={ROUTES.CLIENTS}
            value={inactiveAccounts}
            icon="/icons/new.svg"
          />
          <DashboardComponents.StatCard
            title="Compte activé"
            link={ROUTES.CLIENTS}
            value={activeAccounts}
            icon="/icons/new.svg"
          />
        </div>
        <div className="row">
        <div className="graph-container">
          <div className="canvas-wrapper">
            <canvas id="requestsChart" ref={requestsChartRef} width="900" height="500"></canvas>
            {showDownloadButtons && (
              <div className="vertical-icon-container">
                <FontAwesomeIcon 
                  icon={faImage} 
                  onClick={() => downloadChartAsImage('requestsChart', 'png')} 
                  className="icon-button" 
                  style={{ cursor: 'pointer' }} 
                  title="Télécharger en tant qu'image"
                />
                <FontAwesomeIcon 
                  icon={faFilePdf} 
                  onClick={() => downloadChartAsPDF('requestsChart', 'Nombre des demandes de démonstration par jour')} 
                  className="icon-button" 
                  style={{ cursor: 'pointer' }} 
                  title="Télécharger en tant que PDF"
                />
              </div>
            )}
          </div>
        </div>
      
        <div className="graph-container">
  <div className="canvas-wrapper">
    <canvas id="clientsChart" ref={clientsChartRef} width="900" height="500"></canvas>
    {showDownloadButtons && (
      <div className="vertical-icon-container">
        <FontAwesomeIcon 
          icon={faImage} 
          onClick={() => downloadChartAsImage('clientsChart', 'png')} 
          className="icon-button" 
          style={{ cursor: 'pointer' }} 
          title="Télécharger en tant qu'image"
        />
        <FontAwesomeIcon 
          icon={faFilePdf} 
          onClick={() => downloadChartAsPDF('clientsChart', 'Répartition des utilisateurs')} 
          className="icon-button" 
          style={{ cursor: 'pointer' }} 
          title="Télécharger en tant que PDF"
        />
      </div>
    )}
  </div>
</div>

      <div className="graph-container">
      <div className="canvas-wrapper">
        <canvas id="activeAccountsChart" ref={activeAccountsChartRef} width="900" height="500"></canvas>
        {showDownloadButtons && (
          <div className="vertical-icon-container">
            <FontAwesomeIcon 
              icon={faImage} 
              onClick={() => downloadChartAsImage('activeAccountsChart', 'png')} 
              className="icon-button" 
              style={{ cursor: 'pointer' }} 
              title="Télécharger en tant qu'image"
            />
            <FontAwesomeIcon 
              icon={faFilePdf} 
              onClick={() => downloadChartAsPDF('activeAccountsChart', 'Statut des comptes')} 
              className="icon-button" 
              style={{ cursor: 'pointer' }} 
              title="Télécharger en tant que PDF"
            />
          </div>
        )}
      </div>
      </div>
      
      </div>
      <div className="row">
      <div className="graph-container">
          <div className="canvas-wrapper">
            <canvas id="societeChart" ref={societeChartRef} width="900" height="500"></canvas>
          </div>
        </div>
       
        <div className="graph-container">
          <div className="canvas-wrapper">
            <canvas id="societeChart" ref={societeChartRef} width="900" height="500"></canvas>
            {/* Boutons de téléchargement */}
          </div>
        </div>
       
      </div>
    </div>
  </div>

);
};

export default Dashboard;
