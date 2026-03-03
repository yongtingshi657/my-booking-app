import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Auth.module.css'

export default function Login({setUser}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
        const res = await axios.post('/api/auth/login', formData)
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)
        navigate('/')
    } catch (error) {
        setError(error.response?.data?.message || 'Login Failed. Please Try Again')
    }
  }
  return (
     <div className={styles.container}>
       <div className={styles.loginContainer}>
        <h2>Login</h2>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit}>
           <div className={styles.formContainer}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formContainer}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button className={styles.submitBtn}>Login</button>
        </form>
      </div>
    </div>
  );
}
