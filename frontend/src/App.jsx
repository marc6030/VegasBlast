import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"; // 📌 Importér AuthProvider
import Navbar from "./components/Navbar";
import AppRouter from "./router";
import MainPage from "./pages/MainPage.jsx";

function App() {
  return (
    <AuthProvider> {/* 📌 Gør login-status global for hele appen */}
      <Router>
        <Navbar />
        <AppRouter />
        <MainPage />
      </Router>
    </AuthProvider>
  );
}

export default App;
