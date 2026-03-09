import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import styles from "./Layout.module.css";

export default function SdieBar() {
  return (
    <div className={styles.sideBar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.navLink
        }
      >
        <FaHome />
      </NavLink>
      <NavLink
        to="/bookings"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.navLink
        }
      >
        <FaCalendarAlt />
      </NavLink>

      <NavLink
        to="/clients"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.navLink
        }
      >
        <FaUser />
      </NavLink>
    </div>
  );
}
