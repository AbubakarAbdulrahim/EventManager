import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
const VendorContext = createContext();

export function useVendorContext() {
    return useContext(VendorContext);
}

export default function VendorProvider({ children }) {
    const [vendors, setVendors] = useState(null);
    const { authAxios } = useAuth()


    const fetchVendors = async () => {
        try {
        const response = await authAxios.get('/vendors/');
        setVendors(response.data)
        return response.data;
        } catch (error) {
        console.error('Error fetching services:', error);
        }
    };
    const getVendorById = (id) => {
        if (!vendors) return null;
        return vendors.map(vendor=> vendor.id === id ? vendor : null);
    };

    const value = {
        vendors,
        setVendors,
        getVendorById,
        fetchVendors
    };

    return (
        <VendorContext.Provider value={value}>
            {children}
        </VendorContext.Provider>
    );
}
