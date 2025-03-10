import { Routes, Route } from "react-router-dom";
import MineBlast from "./pages/MineBlast";
import MineBlastLightning from "./pages/MineBlastLightning";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import SaldoPage from "./pages/SaldoPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/mineblast" element={<MineBlast />} />
      <Route path="/mineblastlightning" element={<MineBlastLightning />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/change-saldo" element={<SaldoPage />} />
    </Routes>
  );
}

export default AppRouter;
