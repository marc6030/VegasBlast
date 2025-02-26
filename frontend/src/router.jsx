import { Routes, Route } from "react-router-dom";
import MineBlast from "./pages/MineBlast";
import MineBlastLightning from "./pages/MineBlastLightning";

function AppRouter() {
  return (
    <Routes>
      <Route path="/mineblast" element={<MineBlast />} />
      <Route path="/mineblastlightning" element={<MineBlastLightning />} />
    </Routes>
  );
}

export default AppRouter;
