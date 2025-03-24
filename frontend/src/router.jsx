import { Routes, Route } from "react-router-dom";
import MineBlast from "./pages/MineBlast";
import MineBlastLightning from "./pages/MineBlastLightning";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import SaldoPage from "./pages/SaldoPage";
import MainPage from "./pages/MainPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/MainPage" element={<MainPage />} />
      <Route path="/MineBlast" element={<MineBlast />} />
      <Route path="/MineBlastLightning" element={<MineBlastLightning />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/change-saldo" element={<SaldoPage />} />
    </Routes>
  );
}

export default AppRouter;
