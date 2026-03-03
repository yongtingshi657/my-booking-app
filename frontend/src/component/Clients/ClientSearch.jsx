import styles from "./Clients.module.css";

export default function ClientSearch({ search, setSearch }) {
  // handleClearSearch
  const handleClearSearch = () => {
    setSearch("");
  };
  return (
    <div className={styles.searchBox}>
      <input
        type="text"
        value={search}
        name="search"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Client"
      />

      {search && (
        <button type="button" onClick={handleClearSearch}>
          X
        </button>
      )}
    </div>
  );
}
