import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        // 📌 Sørger for at saldo altid er et afrundet heltal
        const sanitizedUserData = {
            ...userData,
            saldo: userData.saldo ? Math.round(userData.saldo) : 0, // Sikrer at saldo er afrundet
        };
        setUser(sanitizedUserData);
    };

    const logout = () => {
        setUser(null);
    };

    // 📌 Funktion til at opdatere saldo globalt
    const updateSaldo = (newSaldo) => {
        if (user) {
            setUser((prevUser) => ({ ...prevUser, saldo: Math.round(newSaldo) }));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateSaldo }}>
            {children}
        </AuthContext.Provider>
    );
};
