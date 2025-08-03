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
    const normalizedUser = stored ? normalizeUser(JSON.parse(stored)) : null;
    console.log("UserContext - Initializing user:", {
      hasStoredUser: !!stored,
      hasNormalizedUser: !!normalizedUser,
      profileImage: normalizedUser?.profileImage,
    });
    return normalizedUser;
  });

  // Wrapper function to normalize user before setting
  const setNormalizedUser = (newUser) => {
    const normalized = normalizeUser(newUser);
    console.log("UserContext - Setting normalized user:", {
      hasNewUser: !!newUser,
      hasNormalizedUser: !!normalized,
      profileImage: normalized?.profileImage,
    });
    setUser(normalized);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setNormalizedUser }}>
      {children}
    </UserContext.Provider>
  );
};
