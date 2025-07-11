import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export default function UserProvider  ({children}) {
    const {authAxios} = useAuth()

    const fetchUsers = async () => {
    try { 
      const response = await authAxios.get('api-admin/users/')
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };


    const value = {
        fetchUsers,
    
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
