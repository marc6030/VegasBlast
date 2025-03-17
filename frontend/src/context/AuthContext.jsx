import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 📌 Ved første load: Tjek om bruger er gemt i localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        const sanitizedUserData = {
            ...userData,
            saldo: userData.saldo ? Math.round(userData.saldo) : 0,
        };
        setUser(sanitizedUserData);
        localStorage.setItem("user", JSON.stringify(sanitizedUserData));  // Gem
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");  // Fjern ved logout
    };

    const updateSaldo = (newSaldo) => {
        if (user) {
            const updatedUser = { ...user, saldo: Math.round(newSaldo) };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));  // Opdater gemt bruger
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateSaldo }}>
            {children}
        </AuthContext.Provider>
    );
};
