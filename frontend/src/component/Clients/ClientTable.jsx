import styles from "./Clients.module.css";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";

export default function ClientTable({ clients, handleDelete, handleEdit }) {
  const navigate = useNavigate();
  return (
    <div>
      <table className={styles.clientTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => {
              return (
                <tr key={client._id}>
                  <td
                    className={styles.clientName}
                  >{`${client.firstname} ${client.lastname}`}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td className={styles.btnContainer}>
                    <button
                      onClick={() => handleEdit(client)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button> 
                    <button
                      className={styles.viewDetailBtn}
                      onClick={() => navigate(`/clients/${client._id}`)}
                    >
                      View Detail
                    </button>
                   
                    <button
                      onClick={() => handleDelete(client._id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No Clients Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
