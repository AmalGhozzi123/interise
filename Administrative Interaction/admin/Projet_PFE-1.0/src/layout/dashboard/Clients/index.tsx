import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import styles from "../dashboard.module.css";
import { Input } from "@components";
import { DashboardComponents } from "@components";
import ClientDetails from "../ClientDetails";
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
  motDePasse: string;
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

const Clients: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get("http://localhost:5000/api/clients", {
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

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filtered = users.filter(
      (user) =>
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

  const countActiveAccounts = () => {
    return users.filter(user => {
      const lastPayment = user.payments.length > 0 ? user.payments[user.payments.length - 1] : null;
      if (lastPayment) {
        const today = new Date();
        const paymentEndDate = new Date(lastPayment.date_fin);
        return paymentEndDate >= today;
      }
      return false;
    }).length;
  };

  const countInactiveAccounts = () => {
    return users.length - countActiveAccounts();
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
            title="Tous les clients"
            link={ROUTES.USERS}
            value={users.length}
            icon="/icons/product.svg"
          />
          <DashboardComponents.StatCard
            title="Compte désactivé"
            value={countInactiveAccounts()}
            icon="/icons/new.svg"
          />
          <DashboardComponents.StatCard
            title="Compte activé"
            value={countActiveAccounts()}
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
        ) : filteredUsers.length === 0 ? (
          <p style={{ textAlign: "center", color: "red" }}>
            <b>Aucun client trouvé</b>
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} onClick={() => handleUserClick(user)}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.Tel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {dialogOpen && selectedUser && (
          <ClientDetails
            user={selectedUser}
            onClose={() => setDialogOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Clients;
