import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Navbar from "./component/Navbar";
import ClientsList from "./pages/ClientsList/ClientsList";
import Appointments from "./pages/Appointments";
import Layout from "./component/Layout/Layout";
import ClientDetail from "./component/Clients/ClientDetail";
import NotFound from "./pages/NotFound";
import customFetch from "./utils/axios";
import Loading from "./component/Loading";
function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError("");
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await customFetch.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch (error) {
          const message =
            error.response?.data?.message || "Failed to fetch user Data";
          setError(message);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p className="errorText">{error}</p>;
  }

  return (
    <>
      <Router>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <Navbar user={user} setUser={setUser} />
          <Routes>
            {/* public  */}
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

            {/* private */}
            <Route element={<Layout user={user} setUser={setUser} />}>
              <Route path="/" element={<Home />} />
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/bookings" element={<Appointments />} />

              {/* not found */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
