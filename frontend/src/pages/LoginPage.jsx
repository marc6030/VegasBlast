import React, { useState } from "react";
import MineBlast from "./MineBlast"; // Import the MineBlast game component
import "../styles/Login.css"; // Ensure to style the login page properly

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For simulating async login
  const [isFormValid, setIsFormValid] = useState(true); // Form validation flag

  // Function to handle login with real API
  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    setIsFormValid(true);

    // Simple validation before making API request
    if (!username || !password) {
      setError("Please fill in both username and password.");
      setIsFormValid(false);
      setIsLoading(false);
      return;
    }

    try {
      // Make an actual API request for validating user credentials
      const response = await loginUser(username, password);

      if (response.success) {
        setIsLoggedIn(true);
        setError("");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
    setIsLoading(false);
  };

  // Replace this with your actual API call to login the user
  const loginUser = async (username, password) => {
    try {
      // Example fetch request to login API
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true }; // Return success if credentials are correct
      } else {
        return { success: false }; // Return failure if credentials are incorrect
      }
    } catch (error) {
      console.error("Login request failed:", error);
      throw new Error("Something went wrong with the login request.");
    }
  };

  return (
    <div className="login-container">
      {!isLoggedIn ? (
        <div className="login-form">
          <h2>Login</h2>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading} // Disable input during loading
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading} // Disable input during loading
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={isLoading || !isFormValid} // Disable button if invalid form
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      ) : (
        <MineBlast /> // Show the MineBlast game if logged in
      )}
    </div>
  );
}

export default Login;
