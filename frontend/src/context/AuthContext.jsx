import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // 📌 Funktion til at runde saldo
    const roundSaldo = () => {
        if (user && typeof user.saldo === "number") {
            setUser((prevUser) => ({ ...prevUser, saldo: Math.round(prevUser.saldo) }));
        }
    };

    // 📌 Funktion til at opdatere saldo globalt
    const updateSaldo = (newSaldo) => {
        if (user) {
            setUser((prevUser) => ({ ...prevUser, saldo: newSaldo }));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateSaldo, roundSaldo }}>
            {children}
        </AuthContext.Provider>
    );
};
