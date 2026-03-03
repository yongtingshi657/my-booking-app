import { Link, useNavigate } from "react-router-dom";
import styles from './Navbar.module.css'

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const handleLogout = () => {
      localStorage.removeItem('token')
      setUser(null)
      navigate('/')
  }
  return (
    <nav>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.logo}>My Scheduling App</Link>
        <div className={styles.authLinks}>
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
              </>
          ) : (
            <>
              <Link className={styles.link} to="/login">Login</Link>
              <Link className={styles.link} to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
