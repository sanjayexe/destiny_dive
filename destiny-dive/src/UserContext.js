import React, { createContext, useState } from "react";

// Create User Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Normalize user object - ensure profileImage is always available
  const normalizeUser = (userObj) => {
    if (!userObj) return null;
    return {
      ...userObj,
      profileImage: userObj.profileImage || userObj.picture || "",
    };
  };

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  });

  // Wrapper function to normalize user before setting
  const setNormalizedUser = (newUser) => {
    setUser(normalizeUser(newUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser: setNormalizedUser }}>
      {children}
    </UserContext.Provider>
  );
};
