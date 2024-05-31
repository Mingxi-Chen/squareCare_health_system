import React, { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { LS_AUTH_KEY } from "./config";

const UserContext = createContext(null);

//fetches user data from a backend to verify the authenticity of a JWT stored in the local storage
const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Get JWT token from local storage
      const token = localStorage.getItem(LS_AUTH_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        if (token) {
          // Set Authorization header with the token
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Send request to verify token
          const response = await axios.get(`/auth/verify-token`);

          // Store user data from response
          if (response.data.success) {
            // Update user state
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return { user, loading, setUser };
};

const UserProvider = ({ children }) => {
  const { user, loading, setUser } = useFetchUser();

  const contextValue = useMemo(
    () => ({ user, loading, setUser }),
    [user, loading, setUser]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
