import axios from "axios";
import styles from "../dashboard.module.css";
import { Input } from "@components";
import { DashboardComponents } from "@components";
import UserDetails from "../UserDetails";
import React, { useCallback, useEffect, useState } from "react";
import { ROUTES } from "../../../utils/routes";
import * as XLSX from "xlsx";

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
  payments: Payment[];}
  
  interface Payment {
    paymentRef: string;
    amount: number;
    type_paiement: string;
    date_debut: Date;
    date_fin: Date;
  }




const Users: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        params: { page, pageSize },
      });
      const fetchedUsers: User[] = response.data;
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [page, pageSize]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filtered = users.filter(user =>
      user.nom.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.prenom.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const exportToXLS = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users.xlsx");
  };



  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('fr-FR'); 
  };

  const countNewRequestsToday = () => {
    const today = new Date();
    return users.filter((user) => {
      if (user.date_demande instanceof Date) {
        // Si date_demande est une instance de Date
        return user.date_demande.toLocaleDateString("fr-FR") === today.toLocaleDateString("fr-FR");
      } else if (typeof user.date_demande === 'string') {
        // Si date_demande est une chaîne de caractères (représentation de la date)
        const requestDate = new Date(user.date_demande);
        return requestDate.toLocaleDateString("fr-FR") === today.toLocaleDateString("fr-FR");
      }
      // Autres cas non gérés
      return false;
    }).length;
  };
  
  

  return (
    <div className={`${styles.dashboard_content} products_page product-page-inputs`}>
      <div className={styles.dashboard_content_container}>
        <div className={styles.dashboard_content_header}>
          <Input
            type="text"
            value={search}
            label="Chercher.."
            onChange={(e) => handleSearch(e)}
          />
          <img src="/icons/search.gif" className={styles.search_icon} />
        </div>

        <div className={styles.dashboard_cards}>
        <DashboardComponents.StatCard
            title={"Tous les demandes de démonstration"}
            value={users.length}
            icon="/icons/new.svg"
          />
            <DashboardComponents.StatCard
            title={`Nouveaux demandes de démonstration (${getCurrentDate()})`}
            value={countNewRequestsToday()}
            icon="/icons/new.svg"
          />
        </div>
        <div className={styles.filter_container}>
          <div className={styles.filter_group}>  
            <button onClick={exportToXLS} className={styles.exportButton}>
              Exporter en xls
              <img
                src="/images/xls.png"
                alt="Exporter en XLS"
                className={styles.xls_image}
              />
              <img
                src="/images/telecharger.png"
                alt="Télécharger"
                className={styles.telecharger_image}
              />
            </button>
          </div>
          </div>
            {loadingUsers ? (
              <p style={{ textAlign: "center" }}>
                <b>Chargement...</b>
              </p>
            ) : users.length === 0 ? (
              <p style={{ textAlign: "center", color: "red" }}>
                <b>Aucun demande trouvé</b>
              </p>
            ) : (
              <table>
                <thead>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                </thead>
                {filteredUsers.length > 0 && (
                  <tbody>
                    {filteredUsers.map((user: User, index: number) => (
                      <tr key={index} onClick={() => handleUserClick(user)}>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.email}</td>
                        <td>{user.Tel}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            )}
          
          {dialogOpen && selectedUser && (
            <UserDetails
              user={selectedUser}
              onClose={() => setDialogOpen(false)}
            />
          )}
        </div>
      </div>
    
  );
};

export default Users;
