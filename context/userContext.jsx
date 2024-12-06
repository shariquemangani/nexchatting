const { createContext } = require("react");

const UserContext = createContext();

import React, { useState } from "react";

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading, setLoading] = useState(true);

  return (
    <>
      <UserContext.Provider
        value={{ loggedInUser, setLoggedInUser, loading, setLoading }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export default UserContext;
