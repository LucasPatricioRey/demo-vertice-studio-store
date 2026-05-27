import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminPanel } from "./pages/AdminPanel";
import { PublicStore } from "./pages/PublicStore";

const App = () => (
  <Routes>
    <Route path="/" element={<PublicStore />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
