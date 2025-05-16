import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ServiceContext = createContext();

export const useServiceContext = () => useContext(ServiceContext);

export const ServiceProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])
    const {authAxios} = useAuth()

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites")
        if(storedFavorites){
            setFavorites(JSON.parse(storedFavorites))
        }
    
    },[]);

    useEffect(()=>{
        localStorage.setItem('favorites', JSON.stringify(favorites))
    },[favorites]);

    const addToFavorites = (service) => {
        setFavorites((prev) => [...prev, service])
    }

    const removeFromFavorites = (serviceId) => {
        setFavorites(prev => prev.filter(service => service.id !== serviceId))
    }

    const isFavorite = (serviceId) => favorites.some(service => service.id === serviceId);
    const fetchServices = async () => {
    try { 
      const response = await authAxios.get('/vendors/services/');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };


    const value = {
        favorites,
        isFavorite,
        fetchServices,
        addToFavorites,
        removeFromFavorites,
    }

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    )
}
