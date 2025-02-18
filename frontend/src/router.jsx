import { Routes, Route } from "react-router-dom";
import MineBlast from "./pages/MineBlast";

function AppRouter() {
  return (
    <Routes>
      <Route path="/mineblast" element={<MineBlast />} />
    </Routes>
  );
}

export default AppRouter;
