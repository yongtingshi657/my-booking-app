import { useState } from "react";
import styles from "./ClientSearch.module.css";
import axios from "axios";

export default function ClientSearch({ formData, setFormData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // search functionality
  const handleSearchClient = async (e) => {
    const token = localStorage.getItem("token");

    const value = e.target.value;
    setSearchTerm(value);

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);

    try {
      const { data } = await axios.get(`/api/clients/search`, {
        params: { searchQuery: value },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("client", data);
      setSearchResults(data.clients || []);
    } catch (error) {
      console.log(error);
    }

    setIsSearching(false);
  };

  const handleSelectClient = (client) => {
    const fullName = `${client.firstname} ${client.lastname}`;
    setFormData({ ...formData, clientName: fullName, clientId: client._id });

    setSearchResults([]);
    setSearchTerm("");
  };

  const handleCancelSearch = () => {
    setSearchTerm("");
  };

  const handleCancelClient = () => {
    setFormData({
      ...formData,
      clientId: "",
      clientName: "",
    });
    setSearchTerm("");
    setSearchResults([]);
  };

  if (formData.clientId) {
    return (
      <div className={styles.selectedClientDisplay}>
        <span className={styles.clientNameText}>
          <strong>{formData.clientName}</strong>
        </span>
        <button
          type="button"
          className={styles.changeBtn}
          onClick={handleCancelClient}
        >
          X
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.searchBox}>
        <input
          type="text"
          value={searchTerm}
          name="search"
          onChange={handleSearchClient}
          placeholder="Search Client"
        />
        {searchTerm && (
          <button type="button" onClick={handleCancelSearch}>
            X
          </button>
        )}
      </div>

      <div>
        {searchResults.length > 0 && (
          <ul className={styles.resultsDropdown}>
            {searchResults.map((client) => (
              <li key={client._id} onClick={() => handleSelectClient(client)}>
                {`${client.firstname} ${client.lastname} - ${client.phone}`}
              </li>
            ))}
          </ul>
        )}
      </div>

      {searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
        <div className={styles.noResults}>
          No client found
        </div>
      )}
    </>
  );
}
