import { Routes, Route } from "react-router-dom";
import MineBlast from "./pages/MineBlast";
import MineBlastLightning from "./pages/MineBlastLightning";
import Login from "./pages/loginPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/mineblast" element={<MineBlast />} />
      <Route path="/mineblastlightning" element={<MineBlastLightning />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRouter;
