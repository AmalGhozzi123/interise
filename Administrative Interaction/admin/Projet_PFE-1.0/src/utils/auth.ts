// src/utils/auth.ts

export const isLoggedIn = () => {
    return localStorage.getItem("accessToken") !== null;
  };
  
export const logout = () => {
    localStorage.removeItem("accessToken");
  };
  