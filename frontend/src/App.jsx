import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Navbar from "./component/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import ClientsList from "./pages/ClientsList";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch (err) {
          setError("Failed to fetch user Data");
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Home user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
            <Route
            path="/clients"
            element={
              user ? (
                <ClientsList user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> : <Register setUser={setUser} />
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
