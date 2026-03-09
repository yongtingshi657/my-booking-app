import { Navigate, Outlet } from "react-router-dom";
import SdieBar from "./SdieBar";
import styles from './Layout.module.css'

export default function Layout({ user}) {
  if (!user) return <Navigate to="/login" />;
  return (
    <div className={styles.container}>
      <SdieBar />
      <main className={styles.mainContainer}>
      <Outlet />
      </main>
    </div>
  );
}
