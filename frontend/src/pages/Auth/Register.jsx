import customFetch from '../../utils/axios'; ;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Auth.module.css'

export default function Register({setUser}) {
  const [formData, setFormData] = useState({
    name:"",
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
        const res = await customFetch.post('/api/auth/register', formData)
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)
        navigate('/')
    } catch (error) {
        setError(error.response?.data?.message || 'Registration Failed. Please Try Again')
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <h2>Register</h2>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <label>Name</label>
            <input
              type="name"
              placeholder="Enter your name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
          <button className={styles.submitBtn}>Register</button>
        </form>
      </div>
    </div>
  );
}