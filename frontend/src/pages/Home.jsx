import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user, error }) {
  console.log(user);
  return (
    <div>
      <div>
        {error && <p>{error}</p>}
        {user ? (
          <div>
            <h2>Welcome, {user.name}</h2>
          </div>
        ) : (
          <div>
            <h2>Welcome</h2>
            <p>Please Login or Register</p>
            <div>
              <Link to='/login' >Login</Link>
              <Link to='/register' >Register</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
