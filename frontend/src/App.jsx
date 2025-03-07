import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 📌 Importér AuthProvider
import Navbar from "./components/Navbar";
import AppRouter from "./router";

function App() {
  return (
    <AuthProvider> {/* 📌 Gør login-status global for hele appen */}
      <Router>
        <Navbar />
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}

export default App;
