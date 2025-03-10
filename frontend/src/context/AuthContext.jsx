import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // 📌 Funktion til at opdatere saldo globalt
    const updateSaldo = (newSaldo) => {
        if (user) {
            setUser((prevUser) => ({ ...prevUser, saldo: newSaldo }));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateSaldo }}>
            {children}
        </AuthContext.Provider>
    );
};
