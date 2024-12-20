const { createContext } = require("react");

const UserContext = createContext();

import React, { useState } from "react";

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logOutLoader, setLogOutLoader] = useState(false);
  const [users, setUsers] = useState([]);

  return (
    <UserContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        loading,
        setLoading,
        logOutLoader,
        setLogOutLoader,
        users,
        setUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
