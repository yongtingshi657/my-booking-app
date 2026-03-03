import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./ClientsList.module.css";
import ClientTable from "../component/Clients/ClientTable";
import ClientModal from "../component/Clients/ClientModal";
import { useNavigate } from "react-router-dom";
import ClientSearch from "../component/Clients/ClientSearch";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const [search, setSearch] = useState('')

  const token = localStorage.getItem("token");
  
  //   fetch clients data
  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchClients = async () => {
      try {
        const { data } = await axios.get("/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("data", data);
        setClients(data.clients);
      } catch (error) {
        setError("Failed to fetch Clients");
      }
    };

    fetchClients();
  }, [token]);

  // handle Edit
  const handleEdit = (client) => {
    setEditClient(client);
    setIsModalOpen(true);
  };

  // handle Save
  const handleSaveClient = (newClient) => {
    if(editClient){
      setClients(clients.map((client)=> client._id === newClient._id ? newClient : client ))
    } else {
      setClients([...clients, newClient])
    }

    setEditClient(null)
    setIsModalOpen(false)
  }

  // handle Delete
  const handleDelete = async (id) => {
    try {
      if (!token) {
        setError("No authentication token found. Please Log in");
        return;
      }
      await axios.delete(`/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      setError("Failed to Delete Client");
    }
  };

  // search
  const filteredClients = clients.filter(client => {
    const searchLowerCase = search.toLocaleLowerCase()
      return (
        client.firstname.toLowerCase().includes(searchLowerCase) ||
         client.lastname.toLowerCase().includes(searchLowerCase) ||
         client.email.toLowerCase().includes(searchLowerCase) ||
         client.phone.includes(searchLowerCase)
      )
  })

  return (
    <>
      <div className={styles.clientContainer}>
        <div className={styles.headerSection}>
          <h2>My Clients List</h2>
          <button className={styles.addBtn} onClick={()=>setIsModalOpen(true)}>
            <span>+ Add Client</span>
          </button>
        </div>
      <ClientSearch search={search} setSearch={setSearch} />
        <ClientModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditClient(null)
          }}
          key={editClient?._id || "new"}
          client={editClient}
          onSave={handleSaveClient}
        />
        <div className={styles.tableContainer}>
          {error && <p className={styles.errorText}>{error}</p>}
          <ClientTable
            clients={filteredClients}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>
      </div>
    </>
  );
}
