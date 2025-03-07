import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 📌 Tjek om brugeren er logget ind ved app-start
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // 📌 Login-funktion
    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData)); // 🔥 Gem i localStorage
        setUser(userData); // 🔥 Opdater global state
    };

    // 📌 Logout-funktion
    const logout = () => {
        localStorage.removeItem("user"); // 🔥 Fjern fra localStorage
        setUser(null); // 🔥 Nulstil state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
