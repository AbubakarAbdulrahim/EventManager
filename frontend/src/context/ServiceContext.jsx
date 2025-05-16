import { createContext, useState, useContext, useEffect } from "react";

// import { searchMovies, getPopularMovies } from "../services/api";

const ServiceContext = createContext();

export const useServiceContext = () => useContext(ServiceContext);

export const ServiceProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])

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
    


    const value = {
        favorites,
        isFavorite,
        addToFavorites,
        removeFromFavorites,
    }

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    )
}
